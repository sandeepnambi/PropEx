
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined');
  process.exit(1);
}

const users = [
  {
    email: 'admin@propex.com',
    password: 'PropEx@2026!',
    firstName: 'System',
    lastName: 'Admin',
    role: 'Admin',
    phone: '1234567890'
  },
  {
    email: 'phani@gmail.com',
    password: 'PropEx@2026!',
    firstName: 'Phani',
    lastName: 'Manager',
    role: 'Manager',
    phone: '2234567890'
  },
  {
    email: 'balaji@gmail.com',
    password: 'PropEx@2026!',
    firstName: 'Balaji',
    lastName: 'Owner',
    role: 'Owner',
    phone: '3234567890'
  },
  {
    email: 'sandeep@gmail.com',
    password: 'PropEx@2026!',
    firstName: 'Sandeep',
    lastName: 'Tenant',
    role: 'Tenant',
    phone: '4234567890'
  },
  {
    email: 'kiran.k@gmail.com',
    password: 'PropEx@2026!',
    firstName: 'Kiran',
    lastName: 'Buyer',
    role: 'Buyer',
    phone: '5234567890'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`Updating password for ${userData.role}: ${userData.email}`);
        existingUser.password = userData.password;
        await existingUser.save();
      } else {
        console.log(`Creating new ${userData.role}: ${userData.email}`);
        await User.create(userData);
      }
    }

    console.log('\n--- Credentials for all roles ---');
    users.forEach(u => {
      console.log(`Role: ${u.role.padEnd(8)} | Email: ${u.email.padEnd(20)} | Password: ${u.password}`);
    });

    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
