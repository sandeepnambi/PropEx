
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined');
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@propex.com';
    const adminPassword = 'PropEx@2026!';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        firstName: 'System',
        lastName: 'Admin',
        role: 'Admin',
        phone: '1234567890'
      });
      console.log('Admin user created successfully');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    }

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
