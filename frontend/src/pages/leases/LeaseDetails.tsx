import { useEffect, useState } from 'react';
import { leaseApi, documentApi } from '../../lib/api/lease';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  IndianRupee, 
  Home, 
  User, 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  ShieldCheck,
  MapPin,
  Mail,
  Loader2,
  Clock,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function LeaseDetails() {
  const { id } = useParams();
  const [lease, setLease] = useState<any>(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const [leaseRes, docsRes] = await Promise.all([
      leaseApi.getById(id as string),
      documentApi.getByLeaseId(id as string)
    ]);
    if (leaseRes.status === 'success') setLease(leaseRes.data.lease);
    if (docsRes.status === 'success') setDocuments(docsRes.data.documents);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('document', e.target.files[0]);
    formData.append('leaseId', id as string);

    const res = await documentApi.upload(formData);
    if (res.status === 'success') {
      fetchData(); // Refresh data
    }
    setUploading(false);
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const res = await documentApi.delete(docId);
    if (res.status === 'success') {
      fetchData();
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gray-400 font-medium animate-pulse">Loading agreement details...</p>
    </div>
  );

  if (!lease) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="w-16 h-16 text-rose-500" />
      <h2 className="text-2xl font-bold text-white">Lease Not Found</h2>
      <Link to="/leases" className="text-primary hover:underline">Return to Management</Link>
    </div>
  );

  const StatusPill = ({ status }: { status: string }) => {
    const icons = {
      active: <CheckCircle2 className="w-4 h-4" />,
      expired: <History className="w-4 h-4" />,
      terminated: <XCircle className="w-4 h-4" />,
    };
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      expired: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      terminated: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };
    
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/leases" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Management
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
              Lease Agreement
              <span className="text-primary/30 text-2xl font-medium">#{lease._id.slice(-6)}</span>
            </h1>
          </div>
          <StatusPill status={lease.leaseStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</p>
                  <p className="text-lg font-bold text-white">{new Date(lease.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</p>
                  <p className="text-lg font-bold text-white">{new Date(lease.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* General Information Section */}
            <div className="glass p-8 rounded-3xl border border-white/5 shadow-professional overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-32 h-32 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Agreement Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Property Column */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Property Info
                  </label>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-lg font-bold text-white mb-1">{lease.propertyId?.title}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {lease.propertyId?.address}
                    </p>
                    <Link to={`/listings/${lease.propertyId?._id}`} className="inline-block mt-4 text-xs font-bold text-primary hover:underline">
                      View Listing Page →
                    </Link>
                  </div>
                </div>

                {/* Tenant Column */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tenant Details
                  </label>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-lg font-bold text-white mb-1">
                      {lease.tenantId?.firstName} {lease.tenantId?.lastName}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {lease.tenantId?.email}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <div className="px-3 py-1 bg-secondary rounded-lg text-[10px] font-bold text-gray-400 uppercase">
                        Verified Tenant
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Section */}
                <div className="md:col-span-2 space-y-4 pt-4">
                  <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Financial Structure
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                      <p className="text-xs text-emerald-500/60 font-bold mb-1">Monthly Rent</p>
                      <p className="text-2xl font-black text-white">₹{lease.rentAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
                      <p className="text-xs text-amber-500/60 font-bold mb-1">Security Deposit</p>
                      <p className="text-2xl font-black text-white">₹{lease.securityDeposit.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl">
                      <p className="text-xs text-blue-500/60 font-bold mb-1">Billing Cycle</p>
                      <p className="text-2xl font-black text-white capitalize">{lease.paymentFrequency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Documents */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/5 shadow-professional h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Vault
                </h2>
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  uploading ? 'bg-gray-800 text-gray-500' : 'bg-primary text-gray-900 hover:scale-105 active:scale-95'
                }`}>
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {uploading ? 'UPLOADING...' : 'UPLOAD'}
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>

              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-white/5 rounded-2xl">
                    <FileText className="w-12 h-12 text-gray-800 mb-4" />
                    <p className="text-gray-500 text-sm font-medium text-center">No digital copies of this agreement have been uploaded yet.</p>
                  </div>
                ) : documents.map((doc: any) => (
                  <div key={doc._id} className="group p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{doc.fileName}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-0.5">
                            Added {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`http://localhost:5001${doc.fileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDeleteDoc(doc._id)}
                          className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {documents.length > 0 && (
                <p className="text-[10px] text-center text-gray-600 mt-6 uppercase tracking-widest font-bold">
                  Encryption Secured Vault
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
