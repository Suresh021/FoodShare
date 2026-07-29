import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const SECRET = process.env.JWT_SECRET || "foodshare123";

// Helper validator for email and 10-digit phone
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // Must be clean 10 digits
  const cleanPhone = String(phone).trim();
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(cleanPhone);
};

const signup = async (req, res) => {
  try {
    let { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    phone = String(phone).trim();

    // Strict Email Format Check
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Strict 10-Digit Phone Check
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone number must be a valid 10-digit number" });
    }

    // Strict Password Length
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      phone,
      role
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        rating: newUser.rating,
        totalDeliveries: newUser.totalDeliveries,
        ratingCount: newUser.ratingCount,
        servingTarget: newUser.servingTarget,
        address: newUser.address,
        businessType: newUser.businessType,
        vehicleType: newUser.vehicleType
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Unable to create user" });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    email = String(email).trim().toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        rating: user.rating,
        totalDeliveries: user.totalDeliveries,
        ratingCount: user.ratingCount,
        servingTarget: user.servingTarget,
        address: user.address,
        businessType: user.businessType,
        vehicleType: user.vehicleType
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

export { login, signup };
