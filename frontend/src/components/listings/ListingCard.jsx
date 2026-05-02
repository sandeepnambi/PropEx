// src/components/listings/ListingCard.jsx

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ListingCard = ({ listing }) => {
    const navigate = useNavigate();
    const { user, token, API_BASE_URL, checkAuthStatus } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleProtectedAction = (e, action) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            toast.error('Please login first to move forward');
            return;
        }
        action();
    };

    const handleSave = async (e) => {
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
                await checkAuthStatus();
            }
        } catch (error) {
            console.error('Error saving property:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="group bg-surface/30 backdrop-blur-md overflow-hidden rounded-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/5 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(223,166,89,0.15)] h-full flex flex-col">
            {/* Image Section */}
            <div className="relative w-full h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${listing.title}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-primary text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {propertyType}
                    </span>
                </div>

                {/* Save Action */}
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 ${
                        isSaved ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/10 text-white hover:bg-rose-500/80 hover:border-rose-500'
                    } ${isSaving ? 'animate-pulse' : 'opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0'}`}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    )}
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-auto">
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                            <button 
                                onClick={(e) => handleProtectedAction(e, () => navigate(`/listings/${listing._id}`))}
                                className="hover:text-primary transition-colors text-left font-black tracking-tight"
                            >
                                {listing.title}
                            </button>
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 mb-6 font-bold text-xs uppercase tracking-widest">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        <span className="truncate">{location}</span>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 transition-colors group-hover:bg-white/10">
                            <span className="text-primary font-black text-sm">{listing.bedrooms || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Beds</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 transition-colors group-hover:bg-white/10">
                            <span className="text-primary font-black text-sm">{listing.bathrooms || 0}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Baths</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 transition-colors group-hover:bg-white/10">
                            <span className="text-primary font-black text-sm">{listing.sqFt ? (listing.sqFt / 1000).toFixed(1) : '—'}k</span>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">SqFt</span>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Valuation</p>
                        <p className="text-2xl font-black text-white tracking-tighter">
                            {formatCurrency(listing.price)}
                        </p>
                    </div>
                    <button 
                        onClick={(e) => handleProtectedAction(e, () => navigate(`/listings/${listing._id}`))}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary transition-all duration-300 hover:bg-primary hover:text-gray-900 group-hover:scale-110 shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
