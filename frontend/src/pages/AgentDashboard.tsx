import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home as HomeIcon, PlusCircle, MessageSquare, Loader2, AlertCircle, Users, IndianRupee, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CreateListingForm from '../components/agent/CreateListingForm';
import AgentListings from '../components/agent/AgentListings';
import AgentLeads from '../components/agent/AgentLeads';
import TenantPanel from '../components/agent/TenantPanel';
import PaymentManagement from '../components/agent/PaymentManagement';
import AnalyticsSection from '../components/agent/AnalyticsSection';
import type { IListing } from '../types';

type AgentTab = 'listings' | 'create' | 'leads' | 'tenants' | 'payments' | 'analytics';

const AgentDashboard = () => {
  const { user, isLoading, role } = useAuth();
  const [activeTab, setActiveTab] = useState<AgentTab>('listings');
  const [stats, setStats] = useState({
    activeListings: 0,
    activeLeads: 0,
    totalCollected: 0,
    vacancyRate: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [myListings, setMyListings] = useState<IListing[]>([]);
  const [editingListing, setEditingListing] = useState<IListing | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab') as AgentTab;

  useEffect(() => {
    if (tabParam && ['listings', 'create', 'leads', 'tenants', 'payments', 'analytics'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    // Redirect to home if not agent or still loading
    if (!isLoading && !['Admin', 'Manager', 'Owner'].includes(role || '')) {
      navigate('/');
    }
  }, [isLoading, role, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !['Admin', 'Manager', 'Owner'].includes(role || '')) return;
      
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
          
          const activeListings = listings.filter((listing: { status: string }) => listing.status === 'Active').length;
          
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
            activeLeads = leads.filter((lead: { status: string }) => 
              ['New', 'Contacted', 'Converted'].includes(lead.status)
            ).length;
          }

          // Fetch Analytics (Total Collected, Vacancy, etc.)
          const analyticsResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/analytics/management`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          let totalCollected = 0;
          let vacancyRate = 0;

          if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json();
            totalCollected = analyticsData.data?.totalCollected || 0;
            vacancyRate = analyticsData.data?.vacancyRate || 0;
          }

          setStats({
            activeListings,
            activeLeads,
            totalCollected,
            vacancyRate,
          });
          setMyListings(listings);
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

  if (!user || !['Admin', 'Manager', 'Owner'].includes(role || '')) {
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

  const handleEdit = (listing: any) => {
    setEditingListing(listing);
    setActiveTab('create');
  };

  const handleCreateSuccess = () => {
    setActiveTab('listings');
    setEditingListing(null);
    window.location.reload();
  };

  const tabs: { id: AgentTab; label: string; icon: LucideIcon }[] = [
    { id: 'listings', label: 'My Listings', icon: HomeIcon },
    { id: 'create', label: 'Create New Listing', icon: PlusCircle },
    { id: 'leads', label: 'Inquiries', icon: MessageSquare },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'payments', label: 'Payments', icon: IndianRupee },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-800">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">{user.firstName}</span>!
            </h1>
            <p className="text-lg text-gray-400">
              Manage your properties, leads, and grow your business.
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats.activeListings}
                </p>
                <p className="text-sm text-gray-400">Active Listings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats.activeLeads}
                </p>
                <p className="text-sm text-gray-400">Active Leads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {statsLoading ? '...' : stats.vacancyRate}%
                </p>
                <p className="text-sm text-gray-400">Vacancy Rate</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  ₹{statsLoading ? '...' : (stats.totalCollected || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Collected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-800 mb-8">
          <nav className="flex space-x-0">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'create') setEditingListing(null);
                }}
                className={`group flex-1 inline-flex items-center justify-center py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-yellow-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-background'
                } ${index === 0 ? 'rounded-l-2xl' : ''} ${index === tabs.length - 1 ? 'rounded-r-2xl' : ''}`}
              >
                <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-[#1a1d24]/95 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-gray-800">
          <div className="p-8">
            {activeTab === 'listings' && <AgentListings onEdit={handleEdit} />}
            {activeTab === 'create' && (
              <CreateListingForm 
                onSuccess={handleCreateSuccess} 
                initialData={editingListing} 
                onCancel={() => {
                  setEditingListing(null);
                  setActiveTab('listings');
                }}
              />
            )}
            {activeTab === 'leads' && <AgentLeads />}
            {activeTab === 'tenants' && (
              <TenantPanel listings={myListings} isAdmin={role === 'Admin'} />
            )}
            {activeTab === 'payments' && <PaymentManagement />}
            {activeTab === 'analytics' && <AnalyticsSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;