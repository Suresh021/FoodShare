import mongoose from 'mongoose';

const foodlistingSchema = mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    foodType: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    image: {
        type: String
    },

    status: {
        type: String,
        enum: ['available', 'claimed', 'delivered'],
        default: 'available'
    },

    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },

    expiryTime: {
        type: Date
    }
},
    { timestamps: true }
);

const foodlistingModel = mongoose.model("foodListing", foodlistingSchema);
export default foodlistingModel;