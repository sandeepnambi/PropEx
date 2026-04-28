// src/components/admin/AdminListingModeration.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Search, 
    Filter, 
    ExternalLink, 
    CheckCircle, 
    XCircle, 
    Clock, 
    User as UserIcon,
    Calendar,
    MapPin,
    AlertCircle,
    Loader2
} from 'lucide-react';

type ListingStatus = 'Active' | 'Pending' | 'Sold' | 'Leased' | 'Draft';

interface IAdminListing {
    _id: string;
    title: string;
    status: ListingStatus;
    agent: { firstName: string; lastName: string; avatar?: string };
    createdAt: string;
    price: number;
    city: string;
    propertyType: string;
}

const AdminListingModeration: React.FC = () => {
    const { token, API_BASE_URL } = useAuth();
    const [listings, setListings] = useState<IAdminListing[]>([]);
    const [filteredListings, setFilteredListings] = useState<IAdminListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/listings/admin/moderation`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            
            const data = response.data.data.listings;
            setListings(data);
            setFilteredListings(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch listings for moderation.');
            
            // Fallback to mock data for demo if backend fails
            const mockData: IAdminListing[] = [
                { 
                    _id: '65f1a2b3c4d5e6f7a8b9c0d1', 
                    title: 'New Submission: Ocean View Villa (Mock)', 
                    status: 'Draft', 
                    agent: { firstName: 'Bob', lastName: 'Agent' }, 
                    createdAt: '2024-10-19',
                    price: 2500000,
                    city: 'Malibu',
                    propertyType: 'House'
                },
                { 
                    _id: '65f1a2b3c4d5e6f7a8b9c0d2', 
                    title: 'Modern High-rise Penthouse (Mock)', 
                    status: 'Pending', 
                    agent: { firstName: 'Alice', lastName: 'Real' }, 
                    createdAt: '2024-08-01',
                    price: 1200000,
                    city: 'Chicago',
                    propertyType: 'Condo'
                }
            ];
            setListings(mockData);
            setFilteredListings(mockData);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchListings();
        }
    }, [token]);

    useEffect(() => {
        let result = listings;
        
        if (searchQuery) {
            result = result.filter(l => 
                l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                `${l.agent?.firstName || ''} ${l.agent?.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(l => l.status === statusFilter);
        }

        setFilteredListings(result);
    }, [searchQuery, statusFilter, listings]);
    
    const handleStatusChange = async (listingId: string, newStatus: ListingStatus) => {
        setUpdatingId(listingId);
        try {
            await axios.patch(`${API_BASE_URL}/listings/${listingId}`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            setListings(prev => prev.map(l => l._id === listingId ? { ...l, status: newStatus } : l));
            setError(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update listing status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyles = (status: ListingStatus) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]';
            case 'Pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]';
            case 'Draft':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
            case 'Sold':
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'Leased':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: ListingStatus) => {
        switch (status) {
            case 'Active': return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
            case 'Pending': return <Clock className="w-3.5 h-3.5 mr-1.5" />;
            case 'Draft': return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
            case 'Sold': return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
            case 'Leased': return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="glass p-8 rounded-2xl text-center max-w-md mx-auto my-10">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">{error}</p>
            <button onClick={fetchListings} className="text-primary hover:underline">Try again</button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Listing Moderation</h2>
                    <p className="text-gray-400 text-sm">Review and manage all property listings on the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search listings..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-background border border-gray-800 text-white pl-12 pr-4 py-2 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all w-full md:w-64"
                        />
                    </div>
                    <div className="relative group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-background border border-gray-800 text-white pl-12 pr-8 py-2 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Draft">Draft</option>
                            <option value="Sold">Sold</option>
                            <option value="Leased">Leased</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="grid gap-4">
                {filteredListings.length === 0 ? (
                    <div className="glass p-20 rounded-3xl text-center border-dashed border-2 border-gray-800">
                        <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-1">No listings found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filter settings.</p>
                    </div>
                ) : (
                    filteredListings.map((listing) => (
                        <div 
                            key={listing._id} 
                            className="glass group p-4 md:p-6 rounded-2xl border border-gray-800/50 hover:border-primary/30 transition-all duration-300 card-hover"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Info Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className={`flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(listing.status)}`}>
                                            {getStatusIcon(listing.status)}
                                            {listing.status}
                                        </span>
                                        <span className="text-gray-600 text-xs">•</span>
                                        <span className="text-gray-400 text-xs flex items-center font-medium">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-primary transition-colors">
                                        {listing.title}
                                    </h3>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center bg-white/5 px-2 py-1 rounded-lg">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                            {listing.city}
                                        </div>
                                        <div className="flex items-center bg-white/5 px-2 py-1 rounded-lg">
                                            <span className="text-primary font-bold mr-1">₹</span>
                                            {(listing.price / 1000000).toFixed(1)}M
                                        </div>
                                        <div className="flex items-center bg-white/5 px-2 py-1 rounded-lg text-xs uppercase font-semibold">
                                            {listing.propertyType}
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Section */}
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 md:w-64">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center text-background font-bold text-sm shadow-lg">
                                            {listing.agent.firstName.charAt(0)}{listing.agent.lastName.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-bold truncate">{listing.agent.firstName} {listing.agent.lastName}</p>
                                        <p className="text-gray-500 text-xs">Listing Agent</p>
                                    </div>
                                    <UserIcon className="w-4 h-4 text-gray-700" />
                                </div>

                                {/* Actions Section */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 md:flex-none relative">
                                        <select 
                                            value={listing.status} 
                                            onChange={(e) => handleStatusChange(listing._id, e.target.value as ListingStatus)}
                                            disabled={updatingId === listing._id}
                                            className={`w-full bg-background border border-gray-800 text-white px-3 py-2 rounded-xl text-xs font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer ${updatingId === listing._id ? 'opacity-50' : ''}`}
                                        >
                                            {['Active', 'Pending', 'Sold', 'Leased', 'Draft'].map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        {updatingId === listing._id && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <Link 
                                        to={`/listings/${listing._id}`} 
                                        className="p-2.5 bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary rounded-xl transition-all border border-white/5"
                                        title="View Listing Details"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminListingModeration;