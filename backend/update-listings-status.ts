// Script to update all Draft listings to Active status
import mongoose from 'mongoose';
import { Listing } from './src/models/Listing.ts';

async function updateListingsStatus() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate');
        console.log('Connected to MongoDB');

        // Update all Draft listings to Active
        const result = await Listing.updateMany(
            { status: 'Draft' },
            { status: 'Active' }
        );

        console.log(`Updated ${result.modifiedCount} listings from Draft to Active status`);
        
        // Verify the update
        const activeListings = await Listing.find({ status: 'Active' });
        console.log(`Total Active listings: ${activeListings.length}`);
        
        // List the updated listings
        activeListings.forEach(listing => {
            console.log(`- ${listing.title} (${listing._id}) - $${listing.price}`);
        });

    } catch (error) {
        console.error('Error updating listings:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateListingsStatus();
