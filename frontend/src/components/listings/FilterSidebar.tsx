// src/components/listings/FilterSidebar.tsx

import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';

const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment', 'Land'];

const FilterSidebar: FC = () => {
    const navigate = useNavigate();
    interface FilterState {
        priceMin: string;
        priceMax: string;
        beds: string;
        baths: string;
        propertyType: string;
        isFeatured: boolean;
    }

    const [filters, setFilters] = useState<FilterState>({
        priceMin: '',
        priceMax: '',
        beds: '0',
        baths: '0',
        propertyType: '',
        isFeatured: false,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const applyFilters = () => {
        const params = new URLSearchParams();
        
        (Object.entries(filters) as [keyof FilterState, string | boolean][]).forEach(([key, value]) => {
            // Skip if value is falsy, but keep isFeatured when it's false
            if (value === false || (value && value !== '0' && value !== '')) {
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
        navigate('/listings'); // Navigate to the base listings URL
    };

    const inputClasses = "w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80";

    return (
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg sticky top-20 space-y-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
                </svg>
                Advanced Filters
            </h3>

            {/* Price Range */}
            <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">Price Range ($)</label>
                <div className="flex space-x-2">
                    <input type="number" name="priceMin" placeholder="Min" value={filters.priceMin} onChange={handleChange} className={inputClasses} />
                    <input type="number" name="priceMax" placeholder="Max" value={filters.priceMax} onChange={handleChange} className={inputClasses} />
                </div>
            </div>

            {/* Beds and Baths */}
            <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">Min Beds / Baths</label>
                <div className="flex space-x-2">
                    <select name="beds" value={filters.beds} onChange={handleChange} className={`${inputClasses} bg-white`}>
                        {[0, 1, 2, 3, 4, 5].map(n => <option key={`b-${n}`} value={n}>{n}+ Beds</option>)}
                    </select>
                    <select name="baths" value={filters.baths} onChange={handleChange} className={`${inputClasses} bg-white`}>
                        {[0, 1, 2, 3].map(n => <option key={`ba-${n}`} value={n}>{n}+ Baths</option>)}
                    </select>
                </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">Property Type</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleChange} className={`${inputClasses} bg-white`}>
                    <option value="">Any Type</option>
                    {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center pt-2">
                <input
                    id="isFeatured"
                    type="checkbox"
                    name="isFeatured"
                    checked={filters.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Show Featured Listings Only
                </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
                <button onClick={applyFilters} className="w-full bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    Apply Filters
                </button>
                <button onClick={clearFilters} className="w-full text-red-500 border border-red-200 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium">
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;