import mongoose from 'mongoose';

let isConnected = false;

const dbConnect = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is missing on server");
    }

    const db = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    });

    isConnected = db.connections[0].readyState >= 1;
};

export default dbConnect;