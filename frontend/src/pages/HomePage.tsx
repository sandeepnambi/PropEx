// frontend/src/pages/HomePage.tsx
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/listings/SearchForm';
import ListingCard from '../components/listings/ListingCard';
import type { IListing } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HomePage: FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProtectedAction = (to: string) => {
    if (!token) {
      toast.error('Please login first to move forward');
      return;
    }
    navigate(to);
  };

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
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden mb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop" 
            alt="Modern luxury home exterior" 
            className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gray-900/50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-primary to-yellow-600">Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light text-shadow">
              Discover the perfect property with our comprehensive database of homes, condos, and luxury estates. Your next chapter begins today.
            </p>
            
            {/* Search Bar Component */}
            <div className='max-w-5xl mx-auto bg-surface p-3 rounded-2xl shadow-xl border border-gray-800 transition-transform duration-300 hover:scale-[1.01]'>
              <SearchForm />
            </div>
            
            <div className="mt-8 flex justify-center space-x-6 text-white text-sm font-medium">
              <div className="flex items-center bg-surface/80 px-4 py-2 rounded-full border border-white/10">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                10k+ Properties
              </div>
              <div className="flex items-center bg-surface/80 px-4 py-2 rounded-full border border-white/10">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Verified Listings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop" 
                  alt="Modern minimal interior" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-surface p-6 rounded-2xl shadow-xl glass animate-fade-in-up border border-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Top Rated Agency</p>
                    <p className="text-lg font-bold text-white">4.9/5 Average</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <div className="mb-10">
                <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-2">Why Choose Us</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">We make finding your perfect home effortless</h3>
                <p className="text-lg text-gray-400">
                  With over a decade of experience in the real estate market, we have perfected the art of finding you the keys to your dream property.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mr-6 border border-primary/20">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Smart Search Technology</h4>
                    <p className="text-gray-400">Advanced filters and AI-powered recommendations help you discover exactly what matches your lifestyle and budget.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mr-6 border border-primary/20">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Verified Authenticity</h4>
                    <p className="text-gray-400">Every single listing goes through our rigorous verification process to ensure accuracy and prevent fraud.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mr-6 border border-primary/20">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Expert Local Support</h4>
                    <p className="text-gray-400">Our team knows every corner, school district, and hidden gem in your desired neighborhood.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Featured Properties</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Handpicked properties that offer exceptional value and lifestyle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-surface rounded-2xl h-96"></div>
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
              featuredProperties.map((property) => (
                <ListingCard key={property._id} listing={property} />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => handleProtectedAction('/listings')}
              className="btn-primary inline-block text-lg px-8"
            >
              View All Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;