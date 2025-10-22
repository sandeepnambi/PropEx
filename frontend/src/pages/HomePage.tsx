// frontend/src/pages/HomePage.tsx
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/listings/SearchForm';
import type { IListing } from '../types';

const HomePage: FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/listings?limit=3&sort=-viewsCount`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured properties');
        }
        
        const data = await response.json();
        setFeaturedProperties(data.data?.listings || []);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover the perfect property with our comprehensive database of homes, condos, and commercial spaces. Your next home is just a click away.
            </p>
            
            {/* Search Bar Component */}
            <div className='max-w-6xl mx-auto'>
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding your perfect home simple, fast, and reliable
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">Advanced filters and AI-powered recommendations to find exactly what you're looking for.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Properties</h3>
              <p className="text-gray-600">All listings are verified by our team to ensure accuracy and authenticity.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">Professional agents ready to help you every step of the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked properties that offer exceptional value and lifestyle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured properties available at the moment.</p>
              </div>
            ) : (
              featuredProperties.map((property, i) => (
              <div key={property._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop'}
                    alt={`${property.title} photo`}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                  {property.isFeatured && (
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                    <svg className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {property.city}, {property.state}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                        </svg>
                        {property.bedrooms} Beds
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z"></path>
                        </svg>
                        {property.bathrooms} Baths
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                        </svg>
                        {property.sqFt?.toLocaleString() || 'N/A'} sqft
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      ${property.price?.toLocaleString() || 'N/A'}
                    </div>
                    <Link to={`/listings/${property._id}`} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/listings" className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold text-lg">
              View All Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;