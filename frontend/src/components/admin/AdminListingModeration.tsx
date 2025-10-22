// src/components/admin/AdminListingModeration.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

type ListingStatus = 'Active' | 'Pending' | 'Sold' | 'Draft';

interface IAdminListing {
    _id: string;
    title: string;
    status: ListingStatus;
    agent: { firstName: string; lastName: string };
    createdAt: string;
}

interface IAdminListing {
    _id: string;
    title: string;
    status: 'Active' | 'Pending' | 'Sold' | 'Draft';
    agent: { firstName: string; lastName: string };
    createdAt: string;
}

const AdminListingModeration: React.FC = () => {
    const { token } = useAuth();
    const [listings, setListings] = useState<IAdminListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Placeholder: This endpoint needs to be built on the backend
    const fetchListings = async () => {
        setIsLoading(true);
        try {
            // ASSUMING /api/admin/listings endpoint exists to fetch all listings (even Draft/Pending)
            // const response = await axios.get(`${API_BASE_URL}/admin/listings`, {
            //     headers: { 'Authorization': `Bearer ${token}` },
            // });
            // setListings(response.data.data.listings);

            // MOCK DATA:
            setListings([
                { _id: 'm1', title: 'New Submission: Ocean View', status: 'Draft', agent: { firstName: 'Bob', lastName: 'Agent' }, createdAt: '2024-10-19' },
                { _id: 'm2', title: 'High-rise Apartment', status: 'Pending', agent: { firstName: 'Alice', lastName: 'Real' }, createdAt: '2024-08-01' },
                { _id: 'm3', title: 'Historic Townhouse', status: 'Active', agent: { firstName: 'Charlie', lastName: 'King' }, createdAt: '2023-11-20' },
            ] as IAdminListing[]);
        } catch (err) {
            setError('Failed to fetch listings for moderation.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [token]);
    
    const handleStatusChange = async (listingId: string, newStatus: ListingStatus) => {
        // Implement PATCH /api/listings/:id endpoint logic (Admins can change any status)
        console.log(`Updating listing ${listingId} status to ${newStatus}`);
        // After successful update, call fetchListings();
        alert(`Action: Change listing ${listingId} status to ${newStatus}`);
    };

    if (isLoading) return <div className="text-center py-4">Loading listings...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Moderate All Listings</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {listings.map((listing) => (
                            <tr key={listing._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link to={`/listings/${listing._id}`} className="text-secondary hover:underline">
                                        {listing.title}
                                    </Link>
                                    <p className="text-xs text-gray-400">Created: {new Date(listing.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.agent.firstName} {listing.agent.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        listing.status === 'Draft' ? 'bg-red-200 text-red-800' :
                                        listing.status === 'Active' ? 'bg-secondary/20 text-secondary' :
                                        'bg-yellow-200 text-yellow-800'
                                    }`}>
                                        {listing.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <select 
                                        value={listing.status} 
                                        onChange={(e) => handleStatusChange(listing._id, e.target.value as ListingStatus)}
                                        className="p-1 border rounded-md text-sm"
                                    >
                                        {['Active', 'Pending', 'Sold', 'Draft'].map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminListingModeration;