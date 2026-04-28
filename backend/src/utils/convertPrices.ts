import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Listing } from '../models/Listing.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CONVERSION_RATE = 83; // 1 USD ≈ 83 INR
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI not found in environment variables.');
    process.exit(1);
}

async function convertPrices() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI!);
        console.log('Connected successfully.');

        // Fetch all listings
        const listings = await Listing.find({});
        console.log(`Found ${listings.length} listings to process.`);

        let updatedCount = 0;

        for (const listing of listings) {
            // Only convert if the price seems to be in USD (e.g. < 1,000,000)
            // This is a safety check to avoid double-conversion if run twice, 
            // though for villa-level data "5000" is definitely USD-style.
            // We'll apply it to all for now as per user request.

            const oldPrice = listing.price;
            const newPrice = oldPrice * CONVERSION_RATE;

            listing.price = newPrice;
            await listing.save();

            console.log(`Updated "${listing.title}": ₹${oldPrice} -> ₹${newPrice.toLocaleString('en-IN')}`);
            updatedCount++;
        }

        console.log(`\nSuccessfully converted ${updatedCount} listings.`);
    } catch (error) {
        console.error('Error during conversion:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

convertPrices();
