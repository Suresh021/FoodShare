import Delivery from "../models/deliveryModel.js";
import FoodListing from "../models/foodlistingModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

// Helper function to generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// 1. NGO creates an open delivery request for a food listing
const requestDeliveryByNgo = async (req, res) => {
  try {
    const { foodListingId } = req.body;
    const ngoId = req.user.id;

    if (!foodListingId) {
      return res.status(400).json({ message: "Food listing ID is required" });
    }

    const food = await FoodListing.findById(foodListingId).populate('donorId', 'name email');

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    if (food.status !== "available") {
      return res.status(400).json({ message: "This food listing is no longer available" });
    }

    const otpCode = generateOTP();

    const newDelivery = new Delivery({
      foodListingId,
      ngoId,
      partnerId: null,
      otp: otpCode,
      status: "open"
    });

    await newDelivery.save();

    // Update food listing status to requested
    food.status = "requested";
    await food.save();

    // Create notifications for delivery partners
    const partners = await User.find({ role: "partner" });
    const notifications = partners.map((partner) => ({
      recipientId: partner._id,
      senderId: ngoId,
      message: `New open delivery request available for ${food.foodType} (${food.quantity} servings)!`,
      type: "request",
      deliveryId: newDelivery._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: "Delivery request created and sent to delivery partners!",
      data: newDelivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to request delivery" });
  }
};

// 2. Delivery Partner views all open delivery requests
const getOpenDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: "open" })
      .populate({
        path: "foodListingId",
        populate: { path: "donorId", select: "name email phone businessType address rating profileImage" }
      })
      .populate("ngoId", "name email phone servingTarget address profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Delivery Partner claims an open delivery request
const claimOpenDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery request not found" });
    }

    if (delivery.status !== "open") {
      return res.status(400).json({ message: "This delivery request is no longer open" });
    }

    delivery.partnerId = partnerId;
    delivery.status = "claimed";
    await delivery.save();

    // Update food status
    await FoodListing.findByIdAndUpdate(delivery.foodListingId, {
      status: "claimed",
      claimedBy: partnerId
    });

    // Notify NGO
    const partner = await User.findById(partnerId);
    await Notification.create({
      recipientId: delivery.ngoId,
      senderId: partnerId,
      message: `Delivery Partner ${partner.name} has accepted your delivery request!`,
      type: "claim",
      deliveryId: delivery._id
    });

    res.status(200).json({
      success: true,
      message: "Delivery claimed successfully!",
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to claim delivery" });
  }
};

// 4. Delivery Partner submits OTP to complete delivery
const verifyOtpAndComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;
    const partnerId = req.user.id;

    if (!otp) {
      return res.status(400).json({ message: "OTP code is required" });
    }

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.partnerId.toString() !== partnerId) {
      return res.status(403).json({ message: "Not authorized for this delivery" });
    }

    if (delivery.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Incorrect OTP code. Please check with the NGO." });
    }

    delivery.status = "completed";
    delivery.completedAt = new Date();
    await delivery.save();

    // Update Food status
    await FoodListing.findByIdAndUpdate(delivery.foodListingId, { status: "delivered" });

    // Update partner stats
    await User.findByIdAndUpdate(partnerId, { $inc: { totalDeliveries: 1 } });

    // Notify NGO
    await Notification.create({
      recipientId: delivery.ngoId,
      senderId: partnerId,
      message: `Delivery has been completed successfully! Please rate the delivery partner and food donor.`,
      type: "delivery_update",
      deliveryId: delivery._id
    });

    res.status(200).json({
      success: true,
      message: "OTP verified! Delivery marked as complete and received.",
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

// 5. Dual Rating by NGO for Partner & Donor
const rateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerRating, partnerFeedback, donorRating, donorFeedback } = req.body;

    const delivery = await Delivery.findById(id).populate({
      path: "foodListingId",
      select: "donorId"
    });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.partnerRating > 0 || delivery.donorRating > 0) {
      return res.status(400).json({ message: "This delivery has already been rated and cannot be rated again." });
    }

    if (partnerRating) {
      delivery.partnerRating = partnerRating;
      if (partnerFeedback) delivery.partnerFeedback = partnerFeedback;

      if (delivery.partnerId) {
        const partner = await User.findById(delivery.partnerId);
        if (partner) {
          const newCount = (partner.ratingCount || 0) + 1;
          const currentRatingSum = (partner.rating || 0) * (partner.ratingCount || 0);
          partner.ratingCount = newCount;
          partner.rating = Number(((currentRatingSum + Number(partnerRating)) / newCount).toFixed(1));
          await partner.save();
        }
      }
    }

    if (donorRating) {
      delivery.donorRating = donorRating;
      if (donorFeedback) delivery.donorFeedback = donorFeedback;

      const donorId = delivery.foodListingId?.donorId;
      if (donorId) {
        const donor = await User.findById(donorId);
        if (donor) {
          const newCount = (donor.ratingCount || 0) + 1;
          const currentRatingSum = (donor.rating || 0) * (donor.ratingCount || 0);
          donor.ratingCount = newCount;
          donor.rating = Number(((currentRatingSum + Number(donorRating)) / newCount).toFixed(1));
          await donor.save();
        }
      }
    }

    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Ratings submitted successfully!",
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to record ratings" });
  }
};

// Get User's Deliveries (NGO / Partner / Donor)
const getMyDeliveries = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let query = {};
    if (user.role === 'partner') {
      query = { partnerId: userId };
    } else if (user.role === 'ngo') {
      query = { ngoId: userId };
    } else if (user.role === 'donor') {
      const donorFoods = await FoodListing.find({ donorId: userId }).select('_id');
      const foodIds = donorFoods.map(f => f._id);
      query = { foodListingId: { $in: foodIds } };
    }

    const deliveries = await Delivery.find(query)
      .populate({
        path: "foodListingId",
        populate: { path: "donorId", select: "name email phone businessType address rating profileImage" }
      })
      .populate("partnerId", "name email phone rating profileImage vehicleType")
      .populate("ngoId", "name email phone servingTarget address profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id)
      .populate({
        path: "foodListingId",
        populate: { path: "donorId", select: "name email phone businessType address rating profileImage" }
      })
      .populate("partnerId", "name email phone rating profileImage vehicleType")
      .populate("ngoId", "name email phone servingTarget address profileImage");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Notifications controller endpoints
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "Notifications marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("foodListingId")
      .populate("partnerId", "name email phone rating")
      .populate("ngoId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    await Delivery.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Delivery deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  claimOpenDelivery, deleteDelivery, getAllDeliveries, getDeliveryById,
  getMyDeliveries, getUserNotifications as getNotifications, getOpenDeliveries, markNotificationsRead, rateDelivery, requestDeliveryByNgo, verifyOtpAndComplete
};
