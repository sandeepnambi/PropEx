// frontend/src/pages/TenantDashboard.tsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ITenant } from '../types';
import {
  Home,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Loader2,
  Phone,
  Mail,
  FileText,
  Heart,
} from 'lucide-react';
import PaymentHistory from '../components/tenant/PaymentHistory';

const TenantDashboard = () => {
  const { user, isLoading, role } = useAuth();
  const [tenancy, setTenancy] = useState<ITenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  useEffect(() => {
    if (!isLoading && role !== 'Tenant' && role !== 'Buyer') {
      navigate('/');
    }
  }, [isLoading, role, navigate]);

  useEffect(() => {
    const fetchMyLease = async () => {
      const token = localStorage.getItem('token');
      if (!token || (role !== 'Tenant' && role !== 'Buyer')) return;

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/tenants/my-lease`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setTenancy(null);
          setError(null);
          return;
        }
        if (!res.ok) throw new Error('Failed to load lease data.');

        const data = await res.json();
        setTenancy(data.data?.tenancy || null);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) fetchMyLease();
  }, [isLoading, role, API_BASE]);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        setLoadingSaved(true);
        const res = await fetch(`${API_BASE}/users/saved-properties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error('Failed to fetch saved properties');
        
        const data = await res.json();
        const saved = data.data?.savedProperties || [];
        setSavedListings(saved);
      } catch (err) {
        console.error('Error fetching saved properties:', err);
      } finally {
        setLoadingSaved(false);
      }
    };

    if (user) fetchSavedProperties();
  }, [user, API_BASE]);

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Active':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'Active Lease' };
      case 'Expired':
        return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'Lease Expired' };
      case 'Terminated':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'Lease Terminated' };
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20', label: 'Unknown' };
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (role !== 'Tenant' && role !== 'Buyer')) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <header className="mb-10">
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  My Lease Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  Welcome back, <span className="text-primary font-semibold">{user.firstName}</span>. Here's your tenancy overview.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl p-6 mb-8 flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* No Lease Found */}
        {!loading && !error && !tenancy && (
          <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-16 text-center">
            <div className="w-20 h-20 bg-gray-700/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Active Lease</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              You don't have an active lease assigned to your account yet. 
              Please contact your property manager.
            </p>
          </div>
        )}
        {/* Tenancy Data */}
        {tenancy && (() => {
          const daysRemaining = getDaysRemaining(tenancy.leaseEnd);
          const statusConfig = getStatusConfig(tenancy.status);
          const StatusIcon = statusConfig.icon;
          const property = tenancy.property;

          return (
            <div className="space-y-6">

              {/* Status Banner */}
              <div className={`flex items-center justify-between p-5 rounded-2xl border ${statusConfig.bg}`}>
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                  <span className={`font-bold text-lg ${statusConfig.color}`}>{statusConfig.label}</span>
                </div>
                {tenancy.status === 'Active' && (
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${daysRemaining < 30 ? 'text-red-400' : 'text-green-400'}`}>
                      {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                    </p>
                    <p className="text-gray-400 text-sm">remaining on lease</p>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Home className="w-5 h-5 text-primary" />
                    <span>Your Property</span>
                  </h2>
                </div>
                <div className="p-6">
                  {/* Property image */}
                  {property.images && property.images.length > 0 && (
                    <div className="relative h-48 rounded-xl overflow-hidden mb-5">
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <p className="text-white font-bold text-xl">{property.title}</p>
                      </div>
                    </div>
                  )}
                  {(!property.images || property.images.length === 0) && (
                    <h3 className="text-white font-bold text-xl mb-3">{property.title}</h3>
                  )}
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Monthly Rent */}
                <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Monthly Rent</p>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    ₹{tenancy.rentAmount.toLocaleString()}
                  </p>
                </div>

                {/* Lease Start */}
                <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Lease Start</p>
                  </div>
                  <p className="text-lg font-bold text-white">{formatDate(tenancy.leaseStart)}</p>
                </div>

                {/* Lease End */}
                <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Lease End</p>
                  </div>
                  <p className="text-lg font-bold text-white">{formatDate(tenancy.leaseEnd)}</p>
                </div>
              </div>

              {/* Notes */}
              {tenancy.notes && (
                <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-white font-bold mb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Notes from Manager</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{tenancy.notes}</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Payment History Section */}
        <div className="mt-6">
          <PaymentHistory />
        </div>

        {/* Favourited Properties Section */}
        <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 mt-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <span>Favourited Properties</span>
            </h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20">
              {savedListings.length} Saved
            </span>
          </div>

          {loadingSaved ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : savedListings.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-gray-800">
              <Heart className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">You haven't favorited any properties yet.</p>
              <Link to="/listings" className="text-primary hover:underline mt-2 inline-block font-medium">Explore Properties</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedListings.map((property) => (
                <Link 
                  key={property._id}
                  to={`/listings/${property._id}`}
                  className="group bg-surface/50 border border-gray-800 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 flex"
                >
                  <div className="w-32 h-32 flex-shrink-0">
                    <img 
                      src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop'} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate group-hover:text-primary transition-colors">{property.title}</h3>
                    <p className="text-primary font-black mt-1">₹{property.price.toLocaleString()}</p>
                    <div className="flex items-center text-gray-500 text-xs mt-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{property.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mt-6">
          <h3 className="text-white font-bold mb-4">Need Help?</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@propex.com"
              className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-5 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
            <a
              href="tel:+1800000000"
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-5 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              <Phone className="w-4 h-4" />
              <span>Call Support</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TenantDashboard;
