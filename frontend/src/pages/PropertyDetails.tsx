// frontend/src/pages/PropertyDetails.tsx

import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ContactForm from '../components/listings/ContactForm';
import type { IListing } from '../types';

const PropertyDetails: FC = () => {
  const { id = 'unknown' } = useParams<{ id: string }>();
  const [listing, setListing] = useState<IListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/listings/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        
        const data = await response.json();
        setListing(data.data.listing);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && id !== 'unknown') {
      fetchListing();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
        <div className="text-center py-12">
          <p className="text-red-500 text-xl">{error || 'Property not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get the first image URL or use a placeholder
  const mainImageUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop';
  
  // Get agent details
  const agent = typeof listing.agent === 'object' ? listing.agent : null;
  const agentName = agent ? `${agent.firstName} ${agent.lastName}` : 'Unknown Agent';
  const agentPhone = agent?.phone || 'N/A';
  const agentEmail = agent?.email || '';

  return (
    <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Gallery, Details, Description */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">{listing.title}</h1>
            <div className="flex items-center space-x-4">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ${listing.price.toLocaleString()}
              </p>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-gray-600">{listing.city}, {listing.state}</span>
              </div>
            </div>
          </div>
          
          {/* Image Gallery */}
          <div className="relative h-96 w-full rounded-2xl mb-8 overflow-hidden">
            <img
              src={mainImageUrl}
              alt={`${listing.title} main`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow">
              1 / {listing.images?.length || 1}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className='p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 text-center hover:shadow-lg transition-all duration-200'>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  </svg>
                </div>
                <p className="font-bold text-2xl text-gray-800">{listing.bedrooms}</p>
                <p className="text-sm text-gray-600 font-medium">Bedrooms</p>
            </div>
            <div className='p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 text-center hover:shadow-lg transition-all duration-200'>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z"></path>
                  </svg>
                </div>
                <p className="font-bold text-2xl text-gray-800">{listing.bathrooms}</p>
                <p className="text-sm text-gray-600 font-medium">Bathrooms</p>
            </div>
            <div className='p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 text-center hover:shadow-lg transition-all duration-200'>
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </div>
                <p className="font-bold text-2xl text-gray-800">{listing.sqFt.toLocaleString()}</p>
                <p className="text-sm text-gray-600 font-medium">Sq. Ft.</p>
            </div>
            <div className='p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all duration-200'>
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <p className="font-bold text-2xl text-gray-800">{listing.yearBuilt}</p>
                <p className="text-sm text-gray-600 font-medium">Year Built</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Location
            </h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 h-64 w-full rounded-xl flex items-center justify-center text-gray-700 border border-gray-200">
              <div className="text-center">
                <svg className="w-16 h-16 text-primary/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">({listing.latitude}, {listing.longitude})</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Contact Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Contact Agent</h2>
              <p className="text-sm text-gray-600 mb-2">{agentName}</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {agentPhone}
                </span>
              </div>
            </div>
            <ContactForm listingId={listing._id} agentEmail={agentEmail} propertyTitle={listing.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;