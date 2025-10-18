import mongoose from 'mongoose';

export const connectdb = async() => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch(err) {
    console.log("MongoDB connection error: ", err) 
  }
}