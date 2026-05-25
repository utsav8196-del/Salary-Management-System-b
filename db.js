import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
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
