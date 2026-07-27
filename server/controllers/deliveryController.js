import Delivery from "../models/deliveryModel.js";
import FoodListing from "../models/foodlistingModel.js";

const createDelivery = async (req, res) => {
  try {
    const { foodListingId, ngoId } = req.body;
    const partnerId = req.user.id;

    if (!foodListingId || !ngoId) {
      return res.status(400).json({ message: "Food listing ID and NGO ID are required" });
    }

    const food = await FoodListing.findById(foodListingId);

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    if (food.status !== "claimed") {
      return res.status(400).json({ message: "Food must be claimed first" });
    }

    const newDelivery = new Delivery({
      foodListingId,
      partnerId,
      ngoId,
      status: "pending"
    });

    await newDelivery.save();

    res.status(201).json({
      success: true,
      message: "Delivery request created successfully",
      data: newDelivery
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Unable to create delivery" });
  }
};

const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("foodListingId", "foodType quantity description")
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

const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id)
      .populate("foodListingId", "foodType quantity description image")
      .populate("partnerId", "name email phone rating profileImage")
      .populate("ngoId", "name email phone");

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

const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    let delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Check if user is the partner
    if (delivery.partnerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this delivery" });
    }

    delivery.status = status;

    if (status === "completed") {
      delivery.completedAt = new Date();

      // Update food status to delivered
      await FoodListing.findByIdAndUpdate(
        delivery.foodListingId,
        { status: "delivered" }
      );
    }

    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const completeDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Check if user is the partner
    if (delivery.partnerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to complete this delivery" });
    }

    delivery.status = "completed";
    delivery.completedAt = new Date();

    // Update food status to delivered
    await FoodListing.findByIdAndUpdate(
      delivery.foodListingId,
      { status: "delivered" }
    );

    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Delivery completed successfully",
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const rateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    let delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Ensure authorized user (NGO or Partner involved in the delivery)
    const userId = req.user.id;
    if (delivery.ngoId.toString() !== userId && delivery.partnerId.toString() !== userId && req.user.role !== 'ngo') {
      return res.status(403).json({ message: "Not authorized to rate this delivery" });
    }

    delivery.rating = rating;
    if (feedback !== undefined) delivery.feedback = feedback;

    await delivery.save();

    // Recalculate partner's overall rating
    if (delivery.partnerId) {
      const User = (await import("../models/userModel.js")).default;
      const partner = await User.findById(delivery.partnerId);
      if (partner) {
        const currentTotal = partner.totalDeliveries || 0;
        const currentRating = partner.rating || 0;
        const newTotal = currentTotal + 1;
        const newRating = Number(((currentRating * currentTotal + rating) / newTotal).toFixed(1));
        
        partner.totalDeliveries = newTotal;
        partner.rating = newRating;
        await partner.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Delivery rated successfully",
      data: delivery
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPartnerDeliveries = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const deliveries = await Delivery.find({ partnerId })
      .populate("foodListingId", "foodType quantity description")
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

const getNgoDeliveries = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const deliveries = await Delivery.find({ ngoId })
      .populate("foodListingId", "foodType quantity description")
      .populate("partnerId", "name email phone rating")
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

const getDeliveriesByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!status || !["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    const deliveries = await Delivery.find({ status })
      .populate("foodListingId", "foodType quantity")
      .populate("partnerId", "name rating")
      .populate("ngoId", "name")
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

const getMyDeliveries = async (req, res) => {
  try {
    const userId = req.user.id;

    const deliveries = await Delivery.find({
      $or: [{ partnerId: userId }, { ngoId: userId }]
    })
      .populate("foodListingId", "foodType quantity description")
      .populate("partnerId", "name email rating")
      .populate("ngoId", "name email")
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
    const userId = req.user.id;

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Check if user is the partner
    if (delivery.partnerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this delivery" });
    }

    await Delivery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Delivery deleted successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  completeDelivery, createDelivery, deleteDelivery, getAllDeliveries, getDeliveriesByStatus, getDeliveryById, getMyDeliveries, getNgoDeliveries, getPartnerDeliveries, rateDelivery, updateDeliveryStatus
};

