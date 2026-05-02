// src/components/agent/AgentListings.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import ConfirmationModal from '../common/ConfirmationModal';

const AgentListings = ({ onEdit }) => {
    const { API_BASE_URL, token, isLoggedIn } = useAuth();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchAgentListings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/listings/agent/my-listings`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                
                setListings(response.data.data.listings);

            } catch (err) {
                setError('Failed to fetch listings. Check API endpoint.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgentListings();
    }, [API_BASE_URL, token, isLoggedIn]);
    
    // Handle status update
    const handleStatusUpdate = async (id, newStatus) => {
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
    const handleEdit = (listing) => {
        onEdit(listing);
    };

    if (isLoading) return <div className="text-center py-4 text-primary">Loading your listings...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
    if (listings.length === 0) return <div className="text-center py-8 text-gray-500">You haven't created any listings yet.</div>;


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Your Active/Draft Properties</h2>
            
            <div className="overflow-x-auto rounded-xl border border-white/5 shadow-2xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface/30 divide-y divide-gray-800">
                        {listings.map((listing) => (
                            <tr key={listing._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    <Link to={`/listings/${listing._id}`} className="text-primary hover:underline">
                                        {listing.title}
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-1">ID: {listing._id.slice(-8)}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{formatCurrency(listing.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={listing.status} 
                                        onChange={(e) => handleStatusUpdate(listing._id, e.target.value)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border border-white/10 outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer ${
                                            listing.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                            listing.status === 'Draft' ? 'bg-blue-500/10 text-blue-500' :
                                            listing.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Sold">Sold</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{listing.viewsCount}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold space-x-4">
                                    <button onClick={() => handleEdit(listing)} className="text-primary hover:text-primary-hover transition-colors">Edit</button>
                                    <button onClick={() => setDeleteId(listing._id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
