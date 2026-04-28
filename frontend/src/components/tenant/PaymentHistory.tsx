import { useState, useEffect, type FC } from 'react';
import { IndianRupee, Calendar, Loader2, CreditCard } from 'lucide-react';
import type { IPayment } from '../../types';

const PaymentHistory: FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/payments/my-payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to load payment history.');

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

  const handlePayNow = async (paymentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setProcessingId(paymentId);
      const res = await fetch(`${API_BASE}/payments/checkout-session/${paymentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to initiate payment.');

      const data = await res.json();
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message || 'Error processing payment');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-400/10 text-green-400 border-green-400/20';
      case 'Pending':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
      case 'Overdue':
        return 'bg-red-400/10 text-red-400 border-red-400/20';
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
    }
  };

  if (loading) return <div className="text-gray-400 animate-pulse">Loading payments...</div>;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;

  return (
    <div className="bg-[#1a1d24]/95 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <IndianRupee className="w-5 h-5 text-primary" />
          <span>Payment History</span>
        </h2>
        <span className="text-xs text-gray-500">{payments.length} Records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Paid Date</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-white/5 transition-colors duration-150">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-200">{formatDate(payment.dueDate)}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {payment.paymentDate ? formatDate(payment.paymentDate) : '—'}
                  </td>
                  <td className="p-4">
                    {payment.status !== 'Paid' ? (
                      <button
                        onClick={() => handlePayNow(payment._id)}
                        disabled={processingId === payment._id}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-gray-900 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {processingId === payment._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CreditCard className="w-3 h-3" />
                        )}
                        <span>Pay Now</span>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
