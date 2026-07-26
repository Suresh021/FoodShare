import FoodListing from "../models/foodlistingModel.js";

const createFoodListing = async (req, res) => {
  try {
    const { foodType, quantity, description, image, expiryTime } = req.body;
    const donorId = req.user.id;

    if (!foodType || !quantity) {
      return res.status(400).json({ message: "Food type and quantity are required" });
    }

    const newFood = new FoodListing({
      donorId,
      foodType,
      quantity,
      description,
      image,
      expiryTime
    });

    await newFood.save();

    res.status(201).json({
      success: true,
      message: "Food listing created successfully",
      data: newFood
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Unable to create food listing" });
  }
};

const getAllFoodListings = async (req, res) => {
  try {
    const foods = await FoodListing.find()
      .populate("donorId", "name rating profileImage")
      .populate("claimedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFoodListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await FoodListing.findById(id)
      .populate("donorId", "name email phone rating profileImage")
      .populate("claimedBy", "name email phone");

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateFoodListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodType, quantity, description, image, expiryTime } = req.body;
    const userId = req.user.id;

    let food = await FoodListing.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    // Check if user is the owner
    if (food.donorId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    if (foodType) food.foodType = foodType;
    if (quantity) food.quantity = quantity;
    if (description) food.description = description;
    if (image) food.image = image;
    if (expiryTime) food.expiryTime = expiryTime;

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food listing updated successfully",
      data: food
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFoodListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const food = await FoodListing.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    // Check if user is the owner
    if (food.donorId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await FoodListing.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Food listing deleted successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const claimFood = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    let food = await FoodListing.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    if (food.status !== "available") {
      return res.status(400).json({ message: "This food is no longer available" });
    }

    food.status = "claimed";
    food.claimedBy = partnerId;

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food claimed successfully",
      data: food
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const unclaimFood = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    let food = await FoodListing.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food listing not found" });
    }

    // Check if user claimed it
    if (food.claimedBy.toString() !== partnerId) {
      return res.status(403).json({ message: "Not authorized to unclaim this food" });
    }

    food.status = "available";
    food.claimedBy = null;

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food claim removed",
      data: food
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFoodByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;

    const foods = await FoodListing.find({ donorId })
      .populate("donorId", "name rating profileImage")
      .populate("claimedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const searchFoods = async (req, res) => {
  try {
    const { foodType, status } = req.query;

    let query = {};

    if (foodType) {
      query.foodType = { $regex: foodType, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const foods = await FoodListing.find(query)
      .populate("donorId", "name rating profileImage")
      .populate("claimedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAvailableFoods = async (req, res) => {
  try {
    const foods = await FoodListing.find({ status: "available" })
      .populate("donorId", "name rating profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  claimFood, createFoodListing, deleteFoodListing, getAllFoodListings, getAvailableFoods, getFoodByDonor, getFoodListingById, searchFoods, unclaimFood, updateFoodListing
};

