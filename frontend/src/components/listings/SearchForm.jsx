// src/components/listings/SearchForm.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const propertyTypes = ['House', 'Condo', 'Apartment', 'Land', 'Any'];

const SearchForm = ({ isCompact = false }) => {
    const [keyword, setKeyword] = useState('');
    const [propertyType, setPropertyType] = useState('Any');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (propertyType !== 'Any') params.append('propertyType', propertyType);

        navigate(`/listings?${params.toString()}`);
    };

    if (isCompact) {
        return (
            <form onSubmit={handleSubmit} className="flex gap-3 bg-surface/50 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
                <input
                    type="text"
                    placeholder="Location, address, or keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-grow input-premium py-2 px-4 text-xs font-bold"
                />
                <div className="relative">
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="input-premium py-2 px-4 text-xs font-bold w-auto pr-8 appearance-none cursor-pointer"
                    >
                        {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 font-black text-[10px]">↓</span>
                </div>
                <button type="submit" className="bg-primary text-gray-900 py-2 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Search
                </button>
            </form>
        );
    }

    return (
        <div className="bg-surface/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl max-w-5xl mx-auto relative z-10 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5 items-stretch">
                <div className="flex-1 relative">
                    <label className="sr-only" htmlFor="search-keyword">Keyword/Location</label>
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                    </div>
                    <input
                        id="search-keyword"
                        type="text"
                        placeholder="Enter City, ZIP, or Keyword..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="input-premium pl-14 py-4 font-bold text-lg"
                    />
                </div>
                
                <div className="sm:w-64 relative">
                    <label className="sr-only" htmlFor="search-type">Property Type</label>
                    <select
                        id="search-type"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="input-premium py-4 font-bold text-lg appearance-none cursor-pointer pr-10"
                    >
                        {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 font-black">↓</span>
                </div>
                
                <button type="submit" className="bg-primary text-gray-900 sm:w-auto px-10 py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchForm;
