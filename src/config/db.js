import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("CONNECTED TO MONGODB 🚀🚀");
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED: ", error);
    }
};

export default connectDB;