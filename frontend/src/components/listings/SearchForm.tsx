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

    if (isCompact) {
        return (
            <form onSubmit={handleSubmit} className="flex space-x-3 glass-panel p-4">
                <input
                    type="text"
                    placeholder="Location, address, or keyword (e.g., 'pool')"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-grow input-premium py-2 px-3 text-sm"
                />
                <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="input-premium py-2 px-3 text-sm w-auto"
                >
                    {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-2 px-6 shadow-[0_0_10px_rgba(223,166,89,0.2)]">
                    Search
                </button>
            </form>
        );
    }

    return (
        <div className="glass-panel p-6 max-w-4xl mx-auto relative z-10">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex-1">
                    <label className="sr-only" htmlFor="search-keyword">Keyword/Location</label>
                    <input
                        id="search-keyword"
                        type="text"
                        placeholder="Enter City, Zip, or Keyword (e.g., 'pool')"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="input-premium"
                    />
                </div>
                
                <div className="sm:w-48">
                    <label className="sr-only" htmlFor="search-type">Property Type</label>
                    <select
                        id="search-type"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="input-premium"
                    >
                        {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                
                <button type="submit" className="btn-primary sm:w-auto flex items-center justify-center text-lg px-8">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchForm;