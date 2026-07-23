import mongoose from "mongoose";

const deliverySchema = mongoose.Schema({
    foodListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodListing',
        requied: true
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },

    rating: {
        type: Number,
        default: 0
    },

    feedback: {
        type: String
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