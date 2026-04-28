// src/components/listings/ListingCard.tsx

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { IListing } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ListingCardProps {
    listing: IListing;
}

const ListingCard: FC<ListingCardProps> = ({ listing }) => {
    const navigate = useNavigate();
    const { user, token, API_BASE_URL, checkAuthStatus } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Get the first image URL or use a placeholder
    const imageUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop';
    const propertyType = listing.propertyType || 'Property';
    const city = listing.city || 'Unknown';
    const state = listing.state || '';
    const location = state ? `${city}, ${state}` : city;

    useEffect(() => {
        if (user && user.savedProperties) {
            setIsSaved(user.savedProperties.includes(listing._id));
        } else {
            setIsSaved(false);
        }
    }, [user, listing._id]);

    const handleProtectedAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            toast.error('Please login first to move forward');
            return;
        }
        action();
    };

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!token) {
            toast.error('Please login first to move forward');
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/users/save/${listing._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.status === 'success') {
                setIsSaved(!isSaved);
                // Refresh user state to update savedProperties in AuthContext
                await checkAuthStatus();
            }
        } catch (error) {
            console.error('Error saving property:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="group glass-panel overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(223,166,89,0.15)] h-full flex flex-col">
            {/* Image */}
            <div className="relative w-full h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${listing.title} photo`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                
                {/* Property Type Badge */}
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {propertyType}
                </div>

                {/* Favorite Button */}
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`absolute top-4 right-4 rounded-full p-2 shadow-md transition-all duration-200 ${
                        isSaved ? 'bg-primary text-white' : 'bg-surface/90 backdrop-blur-sm text-gray-400 hover:text-red-500'
                    } ${isSaving ? 'opacity-70 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    )}
                </button>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                            <button 
                                onClick={(e) => handleProtectedAction(e, () => navigate(`/listings/${listing._id}`))}
                                className="hover:text-primary transition-colors text-left"
                            >
                                {listing.title}
                            </button>
                        </h3>
                    </div>
                    
                    <p className="text-gray-400 mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">{location}</span>
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 text-gray-400 text-sm mb-4">
                        <span className="flex items-center bg-background px-3 py-1.5 rounded-full">
                            <svg className="w-3.5 h-3.5 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                            </svg>
                            {listing.bedrooms || 0} Beds
                        </span>
                        <span className="flex items-center bg-background px-3 py-1.5 rounded-full">
                            <svg className="w-3.5 h-3.5 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z"></path>
                            </svg>
                            {listing.bathrooms || 0} Baths
                        </span>
                        <span className="flex items-center bg-background px-3 py-1.5 rounded-full">
                            <svg className="w-3.5 h-3.5 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                            </svg>
                            {listing.sqFt ? `${listing.sqFt.toLocaleString()} sqft` : 'N/A'}
                        </span>
                    </div>

                    {/* Agent Info */}
                    {listing.agent && typeof listing.agent === 'object' && (
                        <div className="flex items-center mt-3 pt-3 border-t border-gray-800">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-3">
                                {(listing.agent.firstName?.charAt(0) || 'A')}
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-white">
                                    {listing.agent.firstName} {listing.agent.lastName}
                                </p>
                                <p className="text-gray-500">Listing Agent</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Price and CTA */}
                <div className="mt-auto pt-4 border-t border-gray-800/60">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">
                                {formatCurrency(listing.price)}
                            </p>
                        </div>
                        <button 
                            onClick={(e) => handleProtectedAction(e, () => navigate(`/listings/${listing._id}`))}
                            className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-gray-900 transition-all duration-300 font-bold text-sm whitespace-nowrap shadow-sm hover:shadow-[0_0_15px_rgba(223,166,89,0.4)]"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;