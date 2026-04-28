// frontend/src/components/agent/TenantPanel.tsx

import { useState, useEffect, useCallback } from 'react';
import type { ITenant, IListing } from '../../types';
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
const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    Active: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
    Expired: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
    Terminated: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  };
  const config = configs[status] || { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
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
}: {
  listings: IListing[];
  onSuccess: () => void;
  onCancel: () => void;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors text-sm';
  const labelClass = 'block text-gray-400 text-sm font-medium mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-[#12141a] border border-gray-800 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg flex items-center space-x-2">
        <PlusCircle className="w-5 h-5 text-primary" />
        <span>Assign New Tenant</span>
      </h3>

      {formError && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tenant Email *</label>
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
            className={`${inputClass} ${errors.tenantEmail ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.tenantEmail && <p className="text-red-500 text-xs mt-1">{errors.tenantEmail}</p>}
          <p className="text-gray-600 text-xs mt-1">Must be a user with the "Tenant" or "Buyer" role</p>
        </div>

        <div>
          <label className={labelClass}>Property *</label>
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
              className={`${inputClass} appearance-none pr-10 ${errors.propertyId ? 'border-red-500 ring-1 ring-red-500' : ''}`}
            >
              <option value="">Select a property...</option>
              {listings.map(l => (
                <option key={l._id} value={l._id}>
                  {l.title} — {l.city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          {errors.propertyId && <p className="text-red-500 text-xs mt-1">{errors.propertyId}</p>}
        </div>

        <div>
          <label className={labelClass}>Lease Start *</label>
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
            className={`${inputClass} ${errors.leaseStart ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.leaseStart && <p className="text-red-500 text-xs mt-1">{errors.leaseStart}</p>}
        </div>

        <div>
          <label className={labelClass}>Lease End *</label>
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
            className={`${inputClass} ${errors.leaseEnd ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.leaseEnd && <p className="text-red-500 text-xs mt-1">{errors.leaseEnd}</p>}
        </div>

        <div>
          <label className={labelClass}>Monthly Rent (₹) *</label>
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
            className={`${inputClass} ${errors.rentAmount ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.rentAmount && <p className="text-red-500 text-xs mt-1">{errors.rentAmount}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Any additional notes about this tenancy..."
          value={form.notes}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          id="assignTenantSubmit"
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
          <span>{submitting ? 'Assigning...' : 'Assign Tenant'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-200 font-medium"
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
}: {
  tenancy: ITenant;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}) => {
  const [confirmTerminate, setConfirmTerminate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updating, setUpdating] = useState(false);

  const formatDate = (d: string) =>
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
    <div className="bg-[#12141a] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-200">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {tenancy.tenant?.firstName?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="text-white font-semibold">
                {tenancy.tenant?.firstName} {tenancy.tenant?.lastName}
              </p>
              <p className="text-gray-500 text-xs">{tenancy.tenant?.email}</p>
            </div>
          </div>
          {tenancy.property && (
            <div className="flex items-center space-x-1.5 text-gray-400 text-xs mb-3">
              <Home className="w-3.5 h-3.5" />
              <span>{(tenancy.property as any)?.title} — {(tenancy.property as any)?.city}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
            <span>Start: <span className="text-gray-300">{formatDate(tenancy.leaseStart)}</span></span>
            <span>End: <span className="text-gray-300">{formatDate(tenancy.leaseEnd)}</span></span>
            <span>Rent: <span className="text-primary font-semibold">₹{tenancy.rentAmount.toLocaleString()}/mo</span></span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-3 flex-shrink-0">
          <StatusBadge status={tenancy.status} />
          {updating ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          ) : (
            <div className="flex items-center space-x-2">
              {tenancy.status === 'Active' && (
                <button
                  onClick={() => setConfirmTerminate(true)}
                  id={`terminate-${tenancy._id}`}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1"
                >
                  <XCircle className="w-3 h-3" />
                  <span>Terminate</span>
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  id={`delete-${tenancy._id}`}
                  className="text-xs text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-900/30 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
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
        confirmText="Terminate"
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
        <p className="mt-3 pt-3 border-t border-gray-800/60 text-xs text-gray-500 italic">📝 {tenancy.notes}</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main TenantPanel Component
// ─────────────────────────────────────────────
const TenantPanel = ({ listings, isAdmin }: { listings: IListing[]; isAdmin: boolean }) => {
  const [tenancies, setTenancies] = useState<ITenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'history'>('active');
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
        // For non-admin (Manager/Owner) or Admin without property filter
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedProperty, viewMode, isAdmin]);

  useEffect(() => { fetchTenancies(); }, [fetchTenancies]);

  const handleStatusUpdate = (id: string, status: string) => {
    setTenancies(prev => prev.map(t => t._id === id ? { ...t, status: status as any } : t));
  };

  const handleDelete = (id: string) => {
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

  const inputClass = 'bg-background border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors text-sm';

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary" />
          <span>Tenant Management</span>
        </h2>
        <button
          id="showAssignForm"
          onClick={() => setShowForm(v => !v)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-yellow-600 text-gray-900 font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all duration-200 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Assign Tenant'}</span>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Property Filter */}
        <div className="relative flex-1 min-w-48">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            id="propertyFilter"
            value={selectedProperty}
            onChange={e => setSelectedProperty(e.target.value)}
            className={`${inputClass} pl-9 pr-9 w-full appearance-none`}
          >
            <option value="">{isAdmin ? 'All Properties' : 'Select a Property...'}</option>
            {listings.map(l => (
              <option key={l._id} value={l._id}>{l.title} — {l.city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            id="tenantSearch"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-9 w-full`}
          />
        </div>

        {/* View Toggle */}
        <div className="flex rounded-xl border border-gray-700 overflow-hidden">
          <button
            id="viewActive"
            onClick={() => setViewMode('active')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${viewMode === 'active' ? 'bg-primary text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Active</span>
          </button>
          <button
            id="viewHistory"
            onClick={() => setViewMode('history')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${viewMode === 'history' ? 'bg-primary text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* No results */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">
            {!selectedProperty && !isAdmin
              ? 'Select a property above to view its tenants.'
              : 'No tenants found for the selected filters.'}
          </p>
        </div>
      )}

      {/* Tenancy Cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
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
