import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['request', 'claim', 'delivery_update', 'general'],
            default: 'general'
        },
        deliveryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'delivery',
            default: null
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const notificationModel = mongoose.model('notification', notificationSchema);
export default notificationModel;
