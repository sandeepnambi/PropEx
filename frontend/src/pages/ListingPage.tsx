// frontend/src/pages/ListingPage.tsx

import type { FC } from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { IListing } from '../types';
import SearchForm from '../components/listings/SearchForm';
import ListingCard from '../components/listings/ListingCard';
import FilterSidebar from '../components/listings/FilterSidebar';

type SortOption = 'priceAsc' | 'priceDesc' | 'newest' | 'popular';

const ListingPage: FC = () => {
  const [listings, setListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/listings`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        // Update to match the actual response structure from the backend
        // The backend might be returning the array directly or in a different structure
        if (Array.isArray(data)) {
          setListings(data);
        } else if (data.data && Array.isArray(data.data)) {
          setListings(data.data);
        } else if (data.data && data.data.listings && Array.isArray(data.data.listings)) {
          setListings(data.data.listings);
        } else {
          console.warn('Unexpected API response format:', data);
          setListings([]);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
        setListings([]); // Ensure we have an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on query parameters
  const filteredListings = useMemo(() => {
    if (isLoading) return [];
    
    const min = Number(query.get('priceMin') || '0');
    const max = Number(query.get('priceMax') || Number.MAX_SAFE_INTEGER);
    const minBeds = Number(query.get('beds') || '0');
    const minBaths = Number(query.get('baths') || '0');
    const type = query.get('propertyType') || '';
    const isFeatured = query.get('isFeatured');
    const keyword = (query.get('keyword') || '').toLowerCase().trim();

    return listings.filter((listing) => {
      // Only show agent-listed properties
      if (!listing.agent || (typeof listing.agent === 'object' && !listing.agent._id)) return false;
      
      if (listing.price < min) return false;
      if (listing.price > max) return false;
      if (listing.bedrooms < minBeds) return false;
      if (listing.bathrooms < minBaths) return false;
      if (type && listing.propertyType !== type) return false;
      if (isFeatured === 'true' && !listing.isFeatured) return false;
      if (keyword && !(`${listing.title} ${listing.city}`.toLowerCase().includes(keyword))) return false;
      
      return true;
    });
  }, [listings, location.search, isLoading]);

  // Sort listings based on selected option
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    switch (sortBy) {
      case 'priceAsc':
        return list.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return list.sort((a, b) => {
          // Sort by isFeatured first, then by creation date
          const aScore = (a.isFeatured ? 1 : 0) * 1000 + new Date(a.createdAt).getTime();
          const bScore = (b.isFeatured ? 1 : 0) * 1000 + new Date(b.createdAt).getTime();
          return bScore - aScore;
        });
      default:
        return list;
    }
  }, [sortBy, filteredListings]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Properties</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover your perfect home from our extensive collection of verified properties
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-12">
        <SearchForm isCompact={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar />
        </div>

        {/* Listing Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
            {isLoading 
              ? 'Loading properties...' 
              : `Showing ${sortedListings.length} propert${sortedListings.length === 1 ? 'y' : 'ies'} found`}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          </div>
          
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-96"></div>
              ))}
            </div>
          ) : sortedListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found matching your criteria.</p>
              {query.toString() && (
                <button 
                  onClick={() => window.location.href = '/listings'}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ListingPage;