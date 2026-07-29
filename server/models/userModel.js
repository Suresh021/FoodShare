import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        phone: { type: String, required: true, trim: true },
        role: { type: String, enum: ["donor", "partner", "ngo"], required: true },
        profileImage: { type: String, default: null },
        rating: { type: Number, default: 0 },
        totalDeliveries: { type: Number, default: 0 },
        servingTarget: { type: String, default: "" },
        address: { type: String, default: "" },
        businessType: { type: String, default: "" },
        vehicleType: { type: String, default: "" },
        ratingCount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

// Compare password for login
userSchema.methods.comparePassword = async function (providedPassword) {
    return await bcrypt.compare(providedPassword, this.password);
};

const userModel = mongoose.model("user", userSchema);
export default userModel;