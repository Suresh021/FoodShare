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

    dietaryType: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        default: 'Veg'
    },

    items: [
        {
            name: { type: String },
            quantity: { type: Number },
            description: { type: String },
            dietaryType: { type: String, enum: ['Veg', 'Non-Veg'], default: 'Veg' },
            image: { type: String },
            expiryTime: { type: Date }
        }
    ],

    status: {
        type: String,
        enum: ['available', 'requested', 'claimed', 'delivered'],
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