import mongoose from 'mongoose';

let isConnected = false;
let mongoMemoryInstance = null;

const dbConnect = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    let mongoUri = process.env.MONGO_URI;

    // If MONGO_URI is not set or set to local default, try to connect, and fallback to MongoMemoryServer if offline
    if (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
        try {
            const uriToTry = mongoUri || "mongodb://127.0.0.1:27017/foodshare";
            const db = await mongoose.connect(uriToTry, { serverSelectionTimeoutMS: 2000 });
            isConnected = db.connections[0].readyState >= 1;
            console.log("✅ MongoDB Connected locally at 127.0.0.1:27017");
            return;
        } catch (localErr) {
            console.log("ℹ️ Local MongoDB daemon not detected. Starting in-memory MongoMemoryServer for seamless local testing...");
            try {
                const { MongoMemoryServer } = await import('mongodb-memory-server');
                mongoMemoryInstance = await MongoMemoryServer.create();
                mongoUri = mongoMemoryInstance.getUri();
            } catch (memErr) {
                console.error("❌ Failed to start in-memory MongoDB:", memErr.message);
                throw new Error("No MongoDB instance available. Please set MONGO_URI in server/.env");
            }
        }
    }

    try {
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = db.connections[0].readyState >= 1;
        console.log(`✅ MongoDB Connected successfully!`);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        throw new Error(`Database connection failed: ${err.message}`);
    }
};

export default dbConnect;