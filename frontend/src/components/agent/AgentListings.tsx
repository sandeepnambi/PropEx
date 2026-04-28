// src/components/agent/AgentListings.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import ConfirmationModal from '../common/ConfirmationModal';

interface IAgentListing {
    _id: string;
    title: string;
    price: number;
    status: 'Active' | 'Pending' | 'Sold' | 'Draft';
    viewsCount: number;
    createdAt: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    sqFt: number;
    city: string;
    state: string;
    images: Array<{
        url: string;
        cloudinaryId: string;
        altText?: string;
        orderIndex: number;
    }>;
}

interface AgentListingsProps {
    onEdit: (listing: IAgentListing) => void;
}

const AgentListings: React.FC<AgentListingsProps> = ({ onEdit }) => {
    const { API_BASE_URL, token, isLoggedIn } = useAuth();
    const [listings, setListings] = useState<IAgentListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchAgentListings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/listings/agent/my-listings`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                
                setListings(response.data.data.listings);

            } catch {
                setError('Failed to fetch listings. Check API endpoint.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgentListings();
    }, [API_BASE_URL, token, isLoggedIn]);
    
    // Handle status update
    const handleStatusUpdate = async (id: string, newStatus: 'Active' | 'Pending' | 'Sold' | 'Draft') => {
        try {
        await axios.patch(`${API_BASE_URL}/listings/${id}`, 
            { status: newStatus },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
            
            // Update the local state
            setListings(prev => prev.map(listing => 
                listing._id === id ? { ...listing, status: newStatus } : listing
            ));
            
            console.log(`Status updated to ${newStatus} for listing ${id}`);
        } catch (err) {
            console.error('Failed to update status:', err);
            setError('Failed to update listing status');
        }
    };

    // Handle delete action
    const handleDelete = async () => {
        if (!deleteId) return;
        
        setIsDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/listings/${deleteId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Remove from local state
            setListings(prev => prev.filter(listing => listing._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error('Failed to delete listing:', err);
            setError('Failed to delete listing');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle edit action
    const handleEdit = (listing: IAgentListing) => {
        onEdit(listing);
    };

    if (isLoading) return <div className="text-center py-4">Loading your listings...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
    if (listings.length === 0) return <div className="text-center py-8 text-gray-500">You haven't created any listings yet.</div>;


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Your Active/Draft Properties</h2>
            
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-background">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title / ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-gray-200">
                    {listings.map((listing) => (
                        <tr key={listing._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                <Link to={`/listings/${listing._id}`} className="text-primary hover:underline">
                                    {listing.title}
                                </Link>
                                <p className="text-xs text-gray-400">ID: {listing._id}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatCurrency(listing.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select 
                                    value={listing.status} 
                                    onChange={(e) => handleStatusUpdate(listing._id, e.target.value as 'Active' | 'Pending' | 'Sold' | 'Draft')}
                                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-primary ${
                                        listing.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        listing.status === 'Draft' ? 'bg-gray-400 text-gray-900' :
                                        listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Sold">Sold</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.viewsCount}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button onClick={() => handleEdit(listing)} className="text-primary hover:text-opacity-75">Edit</button>
                                <button onClick={() => setDeleteId(listing._id)} className="text-red-600 hover:text-red-400">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Listing"
                message="Are you sure you want to delete this listing? This action cannot be undone and will remove the property from all search results."
                confirmText="Delete Permanently"
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AgentListings;