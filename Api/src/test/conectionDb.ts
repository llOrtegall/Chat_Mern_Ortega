import mongoose from "mongoose";


export async function testDatabaseConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}
