// src/components/listings/FilterSidebar.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment', 'Land'];

const FilterSidebar = () => {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        priceMin: '',
        priceMax: '',
        beds: '0',
        baths: '0',
        propertyType: '',
        isFeatured: false,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;

        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const applyFilters = () => {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            // Skip if value is falsy, but keep isFeatured when it's true
            if (key === 'isFeatured') {
                if (value) params.append(key, String(value));
            } else if (value && value !== '0' && value !== '') {
                params.append(key, String(value));
            }
        });
        
        navigate(`/listings?${params.toString()}`);
    };

    const clearFilters = () => {
        setFilters({
            priceMin: '',
            priceMax: '',
            beds: '0',
            baths: '0',
            propertyType: '',
            isFeatured: false,
        });
        navigate('/listings');
    };

    const inputClasses = "w-full p-3 border border-white/5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 bg-background shadow-inner placeholder:text-gray-600 outline-none";

    return (
        <div className="bg-surface/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl sticky top-24 space-y-8 border border-white/5 animate-fade-in">
            <h3 className="text-xl font-black text-white flex items-center gap-3 border-b border-white/5 pb-5">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
                </svg>
                <span className="gradient-text uppercase tracking-tighter">Refine Search</span>
            </h3>

            {/* Price Range */}
            <div className="space-y-3">
                <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest">Price Range (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <input type="number" name="priceMin" placeholder="Min" value={filters.priceMin} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div className="relative">
                        <input type="number" name="priceMax" placeholder="Max" value={filters.priceMax} onChange={handleChange} className={inputClasses} />
                    </div>
                </div>
            </div>

            {/* Beds and Baths */}
            <div className="space-y-3">
                <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest">Minimum Specs</label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <select name="beds" value={filters.beds} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer pr-10`}>
                            {[0, 1, 2, 3, 4, 5].map(n => <option key={`b-${n}`} value={n}>{n}+ Beds</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 font-black">↓</span>
                    </div>
                    <div className="relative">
                        <select name="baths" value={filters.baths} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer pr-10`}>
                            {[0, 1, 2, 3].map(n => <option key={`ba-${n}`} value={n}>{n}+ Baths</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 font-black">↓</span>
                    </div>
                </div>
            </div>

            {/* Property Type */}
            <div className="space-y-3">
                <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest">Property Type</label>
                <div className="relative">
                    <select name="propertyType" value={filters.propertyType} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer pr-10`}>
                        <option value="">Any Category</option>
                        {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 font-black">↓</span>
                </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-background/50 border border-white/5 rounded-2xl group cursor-pointer select-none transition-all hover:bg-white/5" onClick={() => setFilters(p => ({ ...p, isFeatured: !p.isFeatured }))}>
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${filters.isFeatured ? 'bg-primary border-primary' : 'border-white/10'}`}>
                    {filters.isFeatured && <span className="text-gray-900 text-xs font-black">✓</span>}
                </div>
                <label className="text-xs text-gray-400 font-bold group-hover:text-white transition-colors cursor-pointer">
                    Premium Listings Only
                </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
                <button onClick={applyFilters} className="w-full bg-primary text-gray-900 py-3.5 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                    Filter Results
                </button>
                <button onClick={clearFilters} className="w-full text-rose-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                    Reset All Filters
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
