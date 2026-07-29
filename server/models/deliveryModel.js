import mongoose from "mongoose";

const deliverySchema = mongoose.Schema({
    foodListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodListing',
        required: true
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },

    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    otp: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ['open', 'claimed', 'pending', 'completed'],
        default: 'open'
    },

    rating: {
        type: Number,
        default: 0
    },

    feedback: {
        type: String
    },

    partnerRating: {
        type: Number,
        default: 0
    },

    partnerFeedback: {
        type: String,
        default: ""
    },

    donorRating: {
        type: Number,
        default: 0
    },

    donorFeedback: {
        type: String,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    completedAt: {
        type: Date,
        default: null
    }
});

const deliveryModel = mongoose.model("delivery", deliverySchema);
export default deliveryModel;