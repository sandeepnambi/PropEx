// frontend/src/components/agent/TenantPanel.jsx

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  PlusCircle,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  History,
  Home,
  Search,
} from 'lucide-react';
import ConfirmationModal from '../common/ConfirmationModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token') || '';

// ─────────────────────────────────────────────
// Status badge component
// ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const configs = {
    Active: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    Expired: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    Terminated: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  };
  const config = configs[status] || { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </span>
  );
};

// ─────────────────────────────────────────────
// Assign Tenant Form
// ─────────────────────────────────────────────
const AssignTenantForm = ({
  listings,
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState({
    tenantEmail: '',
    propertyId: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!form.tenantEmail) newErrors.tenantEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.tenantEmail)) newErrors.tenantEmail = 'Invalid email';
    
    if (!form.propertyId) newErrors.propertyId = 'Property required';
    
    if (!form.leaseStart) newErrors.leaseStart = 'Start date required';
    if (!form.leaseEnd) newErrors.leaseEnd = 'End date required';
    else if (new Date(form.leaseEnd) <= new Date(form.leaseStart)) {
      newErrors.leaseEnd = 'End date must be after start date';
    }
    
    if (!form.rentAmount || parseFloat(form.rentAmount) <= 0) {
      newErrors.rentAmount = 'Rent must be > 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign tenant.');
      onSuccess();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/5 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
      <h3 className="text-white font-black text-xl flex items-center space-x-3">
        <PlusCircle className="w-6 h-6 text-primary" />
        <span className="gradient-text">Assign New Tenant</span>
      </h3>

      {formError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl p-4 text-sm flex items-start gap-2 font-bold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="input-premium-label">Tenant Email *</label>
          <input
            id="tenantEmail"
            name="tenantEmail"
            type="email"
            required
            placeholder="tenant@example.com"
            value={form.tenantEmail}
            onChange={(e) => {
              handleChange(e);
              if (errors.tenantEmail) setErrors(prev => ({ ...prev, tenantEmail: '' }));
            }}
            className={`input-premium ${errors.tenantEmail ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
          />
          {errors.tenantEmail && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.tenantEmail}</p>}
          <p className="text-gray-600 text-[10px] mt-1 uppercase font-bold tracking-widest">Must be an existing Tenant or Buyer account</p>
        </div>

        <div>
          <label className="input-premium-label">Select Property *</label>
          <div className="relative">
            <select
              id="propertyId"
              name="propertyId"
              required
              value={form.propertyId}
              onChange={(e) => {
                handleChange(e);
                if (errors.propertyId) setErrors(prev => ({ ...prev, propertyId: '' }));
              }}
              className={`input-premium appearance-none pr-10 ${errors.propertyId ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
            >
              <option value="">Select a property...</option>
              {listings.map(l => (
                <option key={l._id} value={l._id}>
                  {l.title} — {l.city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          {errors.propertyId && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.propertyId}</p>}
        </div>

        <div>
          <label className="input-premium-label">Lease Start Date *</label>
          <input
            id="leaseStart"
            name="leaseStart"
            type="date"
            required
            value={form.leaseStart}
            onChange={(e) => {
              handleChange(e);
              if (errors.leaseStart) setErrors(prev => ({ ...prev, leaseStart: '' }));
            }}
            className={`input-premium ${errors.leaseStart ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
          />
          {errors.leaseStart && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.leaseStart}</p>}
        </div>

        <div>
          <label className="input-premium-label">Lease End Date *</label>
          <input
            id="leaseEnd"
            name="leaseEnd"
            type="date"
            required
            value={form.leaseEnd}
            onChange={(e) => {
              handleChange(e);
              if (errors.leaseEnd) setErrors(prev => ({ ...prev, leaseEnd: '' }));
            }}
            className={`input-premium ${errors.leaseEnd ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
          />
          {errors.leaseEnd && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.leaseEnd}</p>}
        </div>

        <div>
          <label className="input-premium-label">Monthly Rent (₹) *</label>
          <input
            id="rentAmount"
            name="rentAmount"
            type="number"
            min="0"
            required
            placeholder="e.g. 15000"
            value={form.rentAmount}
            onChange={(e) => {
              handleChange(e);
              if (errors.rentAmount) setErrors(prev => ({ ...prev, rentAmount: '' }));
            }}
            className={`input-premium ${errors.rentAmount ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
          />
          {errors.rentAmount && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.rentAmount}</p>}
        </div>
      </div>

      <div>
        <label className="input-premium-label">Special Provisions (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Any additional notes about this tenancy..."
          value={form.notes}
          onChange={handleChange}
          className="input-premium resize-none"
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-primary text-gray-900 font-black px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 uppercase tracking-widest text-xs"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          {submitting ? 'Assigning...' : 'Assign Tenant'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-xs uppercase tracking-widest"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// ─────────────────────────────────────────────
// Tenancy Card
// ─────────────────────────────────────────────
const TenancyCard = ({
  tenancy,
  onStatusUpdate,
  onDelete,
  isAdmin,
}) => {
  const [confirmTerminate, setConfirmTerminate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updating, setUpdating] = useState(false);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleTerminate = async () => {
    setConfirmTerminate(false);
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/tenants/${tenancy._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: 'Terminated' }),
      });
      if (res.ok) onStatusUpdate(tenancy._id, 'Terminated');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/tenants/${tenancy._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok || res.status === 204) onDelete(tenancy._id);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-[#12141a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-primary/20 transition-all duration-300 shadow-xl group">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-inner">
              {tenancy.tenant?.firstName?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="text-white font-bold text-lg">
                {tenancy.tenant?.firstName} {tenancy.tenant?.lastName}
              </p>
              <p className="text-gray-500 text-xs font-medium">{tenancy.tenant?.email}</p>
            </div>
          </div>
          {tenancy.property && (
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 font-semibold">
              <Home className="w-4 h-4 text-primary/60" />
              <span>{(tenancy.property)?.title} — {(tenancy.property)?.city}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Lease Period</span>
              <span className="text-gray-300 font-bold">{formatDate(tenancy.leaseStart)} — {formatDate(tenancy.leaseEnd)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Monthly Rent</span>
              <span className="text-emerald-500 font-black text-sm">₹{tenancy.rentAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4 flex-shrink-0">
          <StatusBadge status={tenancy.status} />
          {updating ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <div className="flex items-center gap-2">
              {tenancy.status === 'Active' && (
                <button
                  onClick={() => setConfirmTerminate(true)}
                  className="p-2.5 text-rose-500 hover:text-white hover:bg-rose-500/20 border border-rose-500/10 rounded-xl transition-all"
                  title="Terminate Lease"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-2.5 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 border border-white/5 rounded-xl transition-all"
                  title="Delete Record"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmTerminate}
        onClose={() => setConfirmTerminate(false)}
        onConfirm={handleTerminate}
        title="Terminate Tenancy"
        message={`Are you sure you want to terminate the tenancy for ${tenancy.tenant?.firstName} ${tenancy.tenant?.lastName}? This action will mark the lease as terminated.`}
        confirmText="Terminate Now"
        type="danger"
      />

      <ConfirmationModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Tenancy Record"
        message="This will permanently delete the tenancy history. This action cannot be undone."
        confirmText="Delete Permanently"
        type="danger"
      />
      {tenancy.notes && (
        <div className="mt-5 pt-4 border-t border-white/5 text-xs text-gray-500 italic flex gap-2">
          <span className="text-primary not-italic font-bold uppercase tracking-tighter">Note:</span>
          {tenancy.notes}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main TenantPanel Component
// ─────────────────────────────────────────────
const TenantPanel = ({ listings, isAdmin }) => {
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');

  const fetchTenancies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '';
      if (selectedProperty && viewMode === 'history') {
        url = `${API_BASE}/tenants/property/${selectedProperty}/history`;
      } else if (selectedProperty) {
        url = `${API_BASE}/tenants/property/${selectedProperty}`;
      } else {
        const statusParam = viewMode === 'active' ? '?status=Active' : '';
        url = `${API_BASE}/tenants${statusParam}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to load tenancy data.');
      const data = await res.json();
      const list = data.data?.tenancies || data.data?.history || [];
      setTenancies(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedProperty, viewMode, isAdmin]);

  useEffect(() => { fetchTenancies(); }, [fetchTenancies]);

  const handleStatusUpdate = (id, status) => {
    setTenancies(prev => prev.map(t => t._id === id ? { ...t, status: status } : t));
  };

  const handleDelete = (id) => {
    setTenancies(prev => prev.filter(t => t._id !== id));
  };

  const filtered = tenancies.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      t.tenant?.firstName?.toLowerCase().includes(q) ||
      t.tenant?.lastName?.toLowerCase().includes(q) ||
      t.tenant?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <span className="gradient-text">Tenant Hub</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Monitor occupancy and tenancy agreements.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className={`flex items-center gap-2 font-black px-6 py-3 rounded-2xl transition-all duration-300 text-xs uppercase tracking-widest shadow-xl ${
            showForm 
            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
            : 'bg-primary text-gray-900 shadow-primary/20 hover:scale-105 active:scale-95'
          }`}
        >
          {showForm ? <XCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{showForm ? 'Close Form' : 'Assign Tenant'}</span>
        </button>
      </div>

      {/* Assign Form */}
      {showForm && (
        <AssignTenantForm
          listings={listings}
          onSuccess={() => { setShowForm(false); fetchTenancies(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Filters Glass Box */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
        {/* Property Filter */}
        <div className="relative">
          <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2 block">Property Filter</label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={selectedProperty}
              onChange={e => setSelectedProperty(e.target.value)}
              className="input-premium pl-11 pr-10 appearance-none font-bold"
            >
              <option value="">{isAdmin ? 'All Managed Properties' : 'Select a Property...'}</option>
              {listings.map(l => (
                <option key={l._id} value={l._id}>{l.title} — {l.city}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2 block">Tenant Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-premium pl-11 font-bold"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div>
          <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2 block">Filter by Status</label>
          <div className="flex bg-background border border-white/5 rounded-xl p-1 h-[46px]">
            <button
              onClick={() => setViewMode('active')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'active' ? 'bg-primary text-gray-900 shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'history' ? 'bg-primary text-gray-900 shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl p-4 text-sm font-bold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Accessing tenancy records...</p>
        </div>
      )}

      {/* No results */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-24 bg-white/5 border border-white/5 border-dashed rounded-3xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-gray-700" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No Records Found</h3>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">
            {!selectedProperty && !isAdmin
              ? 'Please select a property from the dropdown to see tenant details.'
              : 'We couldn\'t find any tenants matching your current filters.'}
          </p>
        </div>
      )}

      {/* Tenancy Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{filtered.length} matches found</p>
          </div>
          {filtered.map(t => (
            <TenancyCard
              key={t._id}
              tenancy={t}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantPanel;
