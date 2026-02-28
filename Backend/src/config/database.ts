import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URL;

    if (!mongoURI) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;



