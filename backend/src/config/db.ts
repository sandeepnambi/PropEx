import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  // Enable strict mode for queries
  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error connecting to MongoDB: ${errorMessage}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;