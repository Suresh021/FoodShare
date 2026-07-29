
import User from "../models/userModel.js";

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, profileImage, servingTarget, address, businessType, vehicleType } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (servingTarget !== undefined) user.servingTarget = servingTarget;
    if (address !== undefined) user.address = address;
    if (businessType !== undefined) user.businessType = businessType;
    if (vehicleType !== undefined) user.vehicleType = vehicleType;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stats = {
      userId: user._id,
      name: user.name,
      role: user.role,
      rating: user.rating,
      totalDeliveries: user.totalDeliveries,
      profileImage: user.profileImage
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const rateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalRatingPoints = (user.rating * user.totalDeliveries) + rating;
    user.totalDeliveries += 1;
    user.rating = totalRatingPoints / user.totalDeliveries;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      data: {
        userId: user._id,
        newRating: user.rating,
        totalRatings: user.totalDeliveries
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTopRatedUsers = async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const users = await User.find()
      .sort({ rating: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q, role } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    let query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  deleteUser, getAllUsers, getTopRatedUsers, getUserById, getUserProfile, getUserStats,
  rateUser, searchUsers, updateUserProfile
};
