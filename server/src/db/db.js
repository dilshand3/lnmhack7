import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MongoDB connected succesfully || HOST :- ${connectInstance.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed due to ${error}`);
    }
}

export { connectDB }