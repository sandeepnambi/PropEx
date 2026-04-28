import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Listing } from '../models/Listing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function checkPrices() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const listings = await Listing.find({}, 'title price');
        console.log('--- Current Listing Prices ---');
        listings.forEach(l => console.log(`${l.title}: ₹${l.price}`));
        console.log('------------------------------');
    } finally {
        await mongoose.disconnect();
    }
}
checkPrices();
