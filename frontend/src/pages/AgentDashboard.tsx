// frontend/src/pages/AgentDashboard.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home as HomeIcon, PlusCircle, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CreateListingForm from '../components/agent/CreateListingForm';
import AgentListings from '../components/agent/AgentListings';
import AgentLeads from '../components/agent/AgentLeads';

type AgentTab = 'listings' | 'create' | 'leads';

const AgentDashboard = () => {
  const { user, isLoading, role } = useAuth();
  const [activeTab, setActiveTab] = useState<AgentTab>('listings');
  const [stats, setStats] = useState({
    activeListings: 0,
    activeLeads: 0,
    pendingReviews: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not agent or still loading
    if (!isLoading && role !== 'Agent' && role !== 'Admin') {
      navigate('/');
    }
  }, [isLoading, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || (role !== 'Agent' && role !== 'Admin')) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch listings to count active and draft
        const listingsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/listings/agent/my-listings`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          const listings = listingsData.data?.listings || [];
          
          const activeListings = listings.filter((listing: any) => listing.status === 'Active').length;
          const pendingReviews = listings.filter((listing: any) => listing.status === 'Draft').length;
          
          // Fetch leads count
          const leadsResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/leads`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          let activeLeads = 0;
          if (leadsResponse.ok) {
            const leadsData = await leadsResponse.json();
            const leads = leadsData.data?.leads || [];
            // Count leads with status 'New', 'Contacted', or 'Converted' (exclude 'Closed')
            activeLeads = leads.filter((lead: any) => 
              ['New', 'Contacted', 'Converted'].includes(lead.status)
            ).length;
          }

          setStats({
            activeListings,
            activeLeads,
            pendingReviews
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user, role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (role !== 'Agent' && role !== 'Admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const tabs: { id: AgentTab; label: string; icon: LucideIcon }[] = [
    {
      id: 'listings',
      label: 'My Listings',
      icon: HomeIcon
    },
    {
      id: 'create',
      label: 'Create New Listing',
      icon: PlusCircle
    },
    {
      id: 'leads',
      label: 'Leads/Inquiries',
      icon: MessageSquare
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user.firstName}</span>!
            </h1>
            <p className="text-lg text-gray-600">
              Manage your properties, leads, and grow your business.
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : stats.activeListings}
                </p>
                <p className="text-sm text-gray-600">Active Listings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : stats.activeLeads}
                </p>
                <p className="text-sm text-gray-600">Active Leads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : stats.pendingReviews}
                </p>
                <p className="text-sm text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-8">
          <nav className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex-1 inline-flex items-center justify-center py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${tab.id === 'listings' ? 'rounded-l-2xl' : ''} ${tab.id === 'leads' ? 'rounded-r-2xl' : ''}`}
              >
                <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-gray-100">
          <div className="p-8">
            {activeTab === 'listings' && <AgentListings />}
            {activeTab === 'create' && <CreateListingForm onSuccess={() => setActiveTab('listings')} />}
            {activeTab === 'leads' && <AgentLeads />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;