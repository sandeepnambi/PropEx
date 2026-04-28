import { useEffect, useState } from 'react';
import { leaseApi } from '../../lib/api/lease';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  IndianRupee, 
  Home, 
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function LeaseList() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', property: '' });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchLeases();
  }, [filters]);

  const fetchLeases = async () => {
    setLoading(true);
    const res = await leaseApi.getAll(filters);
    if (res.status === 'success') {
      const fetchedLeases = res.data.leases;
      setLeases(fetchedLeases);
      
      // Calculate simple stats
      const total = fetchedLeases.length;
      const active = fetchedLeases.filter((l: any) => l.leaseStatus === 'active').length;
      const revenue = fetchedLeases
        .filter((l: any) => l.leaseStatus === 'active')
        .reduce((acc: number, curr: any) => acc + curr.rentAmount, 0);
      
      setStats({ total, active, revenue });
    }
    setLoading(false);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      expired: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      terminated: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status as keyof typeof styles] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <FileText className="w-10 h-10 text-primary" />
              <span className="gradient-text">Lease Management</span>
            </h1>
            <p className="text-gray-400 mt-2">Oversee and manage property lease agreements</p>
          </div>
          <Link 
            to="/leases/create"
            className="btn-primary flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create New Lease
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 rounded-2xl border border-white/5 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Leases</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="text-primary w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl border border-white/5 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Active Agreements</p>
                <h3 className="text-3xl font-bold text-emerald-500 mt-1">{stats.active}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-emerald-500 w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Monthly Revenue</p>
                <h3 className="text-3xl font-bold text-primary mt-1">₹{stats.revenue.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <IndianRupee className="text-primary w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass p-4 rounded-2xl border border-white/5 mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search property or tenant..."
              className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onChange={(e) => setFilters({ ...filters, property: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 w-4 h-4" />
            <select 
              className="bg-background border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-professional">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Tenant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Lease Term</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Rent</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-surface/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-gray-500 font-medium">Fetching lease data...</p>
                      </div>
                    </td>
                  </tr>
                ) : leases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <p className="text-gray-500 text-lg">No lease agreements found</p>
                    </td>
                  </tr>
                ) : leases.map((lease: any) => (
                  <tr key={lease._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Home className="text-primary w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{lease.propertyId?.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {lease.propertyId?.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xs">
                          {lease.tenantId?.firstName?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-200">
                            {lease.tenantId?.firstName} {lease.tenantId?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{lease.tenantId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        <span>{new Date(lease.startDate).toLocaleDateString()}</span>
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                        <span>{new Date(lease.endDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-emerald-500" />
                        <span className="text-base font-bold text-white">{lease.rentAmount.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 font-medium">/ {lease.paymentFrequency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <StatusBadge status={lease.leaseStatus} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <Link 
                        to={`/leases/${lease._id}`} 
                        className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold group/btn"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
