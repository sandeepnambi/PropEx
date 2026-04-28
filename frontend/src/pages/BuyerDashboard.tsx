import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Heart, 
  MessageSquare, 
  User as UserIcon, 
  Bell, 
  Loader2, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ListingPage from './ListingPage';
import ProfilePage from './ProfilePage';
import type { IListing } from '../types';

type BuyerTab = 'search' | 'saved' | 'inquiries' | 'profile' | 'notifications';

interface Inquiry {
  _id: string;
  listing: {
    _id: string;
    title: string;
    price: number;
    images: { url: string }[];
    city: string;
    state: string;
  };
  message: string;
  status: string;
  createdAt: string;
}

const BuyerDashboard = () => {
  const { user, isLoading, role, token } = useAuth();
  const [activeTab, setActiveTab] = useState<BuyerTab>('search');
  const [savedProperties, setSavedProperties] = useState<IListing[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && role !== 'Buyer') {
      navigate('/');
    }
  }, [isLoading, role, navigate]);

  useEffect(() => {
    if (activeTab === 'saved' && token) {
      fetchSavedProperties();
    } else if (activeTab === 'inquiries' && token) {
      fetchInquiries();
    }
  }, [activeTab, token]);

  const fetchSavedProperties = async () => {
    setSavedLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/users/saved-properties`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSavedProperties(data.data.savedProperties || []);
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setSavedLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/leads/myinquiries`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.data.inquiries || []);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role !== 'Buyer') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">You don't have permission to view this page.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const tabs: { id: BuyerTab; label: string; icon: LucideIcon }[] = [
    { id: 'search', label: 'Search Properties', icon: Search },
    { id: 'saved', label: 'Saved Properties', icon: Heart },
    { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">{user.firstName}</span>!
              </h1>
              <p className="text-lg text-gray-400">
                Find your dream home or manage your property search.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-background/50 p-4 rounded-xl border border-gray-800 text-center min-w-[120px]">
                <p className="text-2xl font-bold text-primary">{user.savedProperties?.length || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Saved</p>
              </div>
              <div className="bg-background/50 p-4 rounded-xl border border-gray-800 text-center min-w-[120px]">
                <p className="text-2xl font-bold text-secondary">{inquiries.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Inquiries</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-800 mb-8 overflow-hidden">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex-1 min-w-[150px] inline-flex items-center justify-center py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-yellow-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-background/50'
                }`}
              >
                <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'search' && (
            <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
              <ListingPage isEmbedded={true} />
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedLoading ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : savedProperties.length > 0 ? (
                savedProperties.map((property) => (
                  <div key={property._id} className="bg-surface rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300 group shadow-lg">
                    <div className="relative h-48">
                      <img 
                        src={property.images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop'} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-primary text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
                        ₹{property.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-primary" />
                        {property.city}, {property.state}
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                        <div className="flex gap-4">
                          <span className="text-gray-400 text-sm"><strong className="text-white">{property.bedrooms}</strong> Bed</span>
                          <span className="text-gray-400 text-sm"><strong className="text-white">{property.bathrooms}</strong> Bath</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/listings/${property._id}`)}
                          className="text-primary font-bold text-sm hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-[#1a1d24]/95 rounded-2xl border border-dashed border-gray-700">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No saved properties yet</h3>
                  <p className="text-gray-400 mb-6">Start exploring listings and heart the ones you love!</p>
                  <button 
                    onClick={() => setActiveTab('search')}
                    className="px-6 py-2 bg-primary text-gray-900 font-bold rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Browse Listings
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {inquiriesLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : inquiries.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry._id} className="bg-[#1a1d24]/95 p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-all shadow-lg">
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={inquiry.listing?.images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop'} 
                          alt={inquiry.listing?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">{inquiry.listing?.title}</h3>
                            <p className="text-primary font-bold">₹{inquiry.listing?.price?.toLocaleString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            inquiry.status === 'New' ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' :
                            inquiry.status === 'Contacted' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' :
                            'bg-green-900/30 text-green-400 border border-green-900/50'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 bg-background/50 p-3 rounded-lg italic">
                          "{inquiry.message}"
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Sent on {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                          <button 
                            onClick={() => navigate(`/listings/${inquiry.listing._id}`)}
                            className="text-primary font-bold hover:underline"
                          >
                            View Property
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-12 rounded-2xl border border-gray-800 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No inquiries yet</h3>
                  <p className="text-gray-400">When you contact a property manager, your inquiry history will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
              <ProfilePage isEmbedded={true} />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-12 rounded-2xl border border-gray-800 text-center">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
              <p className="text-gray-400">You don't have any new notifications at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
