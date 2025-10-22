// src/components/listings/SearchForm.tsx

import { useState } from 'react';
import type { FormEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchFormProps {
    isCompact?: boolean; // Controls visual size and layout for reusability
}

const propertyTypes = ['House', 'Condo', 'Apartment', 'Land', 'Any'];

const SearchForm: FC<SearchFormProps> = ({ isCompact = false }) => {
    const [keyword, setKeyword] = useState('');
    const [propertyType, setPropertyType] = useState('Any');
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Build the query string for the search parameters
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (propertyType !== 'Any') params.append('propertyType', propertyType);

        navigate(`/listings?${params.toString()}`);
    };

    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150";
    const buttonClasses = "w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-150 flex items-center justify-center";
    
    if (isCompact) {
        return (
            <form onSubmit={handleSubmit} className="flex space-x-3 bg-white p-4 shadow-md rounded-xl">
                <input
                    type="text"
                    placeholder="Location, address, or keyword (e.g., 'pool')"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-grow p-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                />
                <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                    {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button type="submit" className="bg-primary text-white px-4 rounded-lg hover:bg-opacity-90 transition duration-150">
                    Search
                </button>
            </form>
        );
    }

    return (
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto relative z-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
                <div className="flex-1">
                    <label className="sr-only" htmlFor="search-keyword">Keyword/Location</label>
                    <input
                        id="search-keyword"
                        type="text"
                        placeholder="Enter City, Zip, or Keyword (e.g., 'pool')"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-lg bg-white/80 backdrop-blur-sm placeholder-gray-500"
                    />
                </div>
                
                <div className="sm:w-32">
                    <label className="sr-only" htmlFor="search-type">Property Type</label>
                    <select
                        id="search-type"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-lg bg-white/80 backdrop-blur-sm"
                    >
                        {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                
                <button type="submit" className="sm:w-auto bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center text-lg transform hover:scale-105">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchForm;