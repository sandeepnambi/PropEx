import { useState, useEffect, type FC } from 'react';
import { IndianRupee, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import type { IPayment } from '../../types';

const PaymentManagement: FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch payments.');

      const data = await res.json();
      setPayments(data.data?.payments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [API_BASE]);

  const handleUpdateStatus = async (paymentId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          paymentDate: newStatus === 'Paid' ? new Date() : null,
          paymentMethod: newStatus === 'Paid' ? 'Cash' : null // Default to cash for manual entry
        }),
      });

      if (res.ok) {
        fetchPayments(); // Refresh list
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const filteredPayments = payments.filter(p => {
    const tenantName = typeof p.tenantId === 'object' && 'tenant' in p.tenantId 
      ? `${(p.tenantId.tenant as any).firstName} ${(p.tenantId.tenant as any).lastName}`.toLowerCase()
      : '';
    const propertyTitle = typeof p.propertyId === 'object' ? p.propertyId.title.toLowerCase() : '';
    return tenantName.includes(searchTerm.toLowerCase()) || propertyTitle.includes(searchTerm.toLowerCase());
  });

  if (loading) return <div className="p-8 text-center text-gray-400">Loading payment records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Payment Tracking</h2>
          <p className="text-gray-400 text-sm">Monitor rent collections and pending payments.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tenant or property..."
            className="w-full bg-background border border-gray-800 rounded-xl py-2 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-gray-800 border-dashed">
            <IndianRupee className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No payment records found matching your search.</p>
          </div>
        ) : (
          filteredPayments.map((payment) => {
            const tenant = typeof payment.tenantId === 'object' ? (payment.tenantId.tenant as any) : null;
            const property = typeof payment.propertyId === 'object' ? payment.propertyId : null;

            return (
              <div key={payment._id} className="bg-[#1a1d24]/95 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      payment.status === 'Paid' ? 'bg-green-400/10' : 'bg-yellow-400/10'
                    }`}>
                      <IndianRupee className={`w-6 h-6 ${
                        payment.status === 'Paid' ? 'text-green-400' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">
                        {tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown Tenant'}
                      </h3>
                      <p className="text-xs text-gray-400">{property ? property.title : 'Unknown Property'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Amount</p>
                      <p className="text-lg font-bold text-white">₹{payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Due Date</p>
                      <p className="text-gray-300">{new Date(payment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${
                        payment.status === 'Paid' 
                          ? 'bg-green-400/10 text-green-400 border-green-400/20' 
                          : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                      }`}>
                        {payment.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{payment.status}</span>
                      </span>
                    </div>
                    {payment.status !== 'Paid' && (
                      <button
                        onClick={() => handleUpdateStatus(payment._id, 'Paid')}
                        className="bg-primary hover:bg-primary-hover text-gray-900 px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-105 active:scale-95"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
