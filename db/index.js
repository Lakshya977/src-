import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
dotenv.config();
const connectDB = async () => {
    try {
        // Debugging information
        console.log('MONGO_URI:', process.env.MONGO_URI);

        const connections = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected: ${connections.connection.host}`);
    } catch (error) {
        console.error(`Connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;