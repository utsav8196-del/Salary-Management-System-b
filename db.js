import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined. Set it in .env or Render environment variables.');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const employeeSchema = new mongoose.Schema({
  full_name:  { type: String, required: true },
  job_title:  { type: String, required: true },
  country:    { type: String, required: true },
  salary:     { type: Number, required: true, min: 1 },
  email:      { type: String, required: true, unique: true },
  hire_date:  { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const Employee = mongoose.model('Employee', employeeSchema);
export default connectDB;
