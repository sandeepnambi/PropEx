import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaseSchema } from '../../lib/validations/lease';
import type { LeaseFormData } from '../../lib/validations/lease';
import { leaseApi } from '../../lib/api/lease';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FilePlus, 
  ArrowLeft, 
  Calendar, 
  IndianRupee, 
  Home, 
  User, 
  Clock,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function CreateLease() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      paymentFrequency: 'monthly',
    }
  });

  const onSubmit = async (data: LeaseFormData) => {
    setError('');
    const res = await leaseApi.create(data);
    if (res.status === 'success') {
      navigate('/leases');
    } else {
      setError(res.message || 'Something went wrong. Please check the input IDs.');
    }
  };

  const inputClasses = "w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600";
  const labelClasses = "block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2";

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / Back Link */}
        <Link 
          to="/leases" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lease Management
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <FilePlus className="text-primary w-7 h-7" />
            </div>
            <span className="gradient-text">Create New Lease</span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Initialize a new property agreement between an owner and a tenant.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="glass p-8 md:p-12 rounded-3xl border border-white/5 shadow-professional space-y-10">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-sm flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {/* Relationships */}
            <div className="space-y-8 md:col-span-2">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-white/5 pb-2">
                <ShieldCheck className="w-5 h-5" />
                Agreement Participants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>
                    <Home className="w-4 h-4 text-primary/70" />
                    Property ID
                  </label>
                  <input 
                    {...register('propertyId')}
                    placeholder="Enter listing ID"
                    className={inputClasses}
                  />
                  {errors.propertyId && <p className="text-rose-500 text-xs mt-2 font-medium">{errors.propertyId.message}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    <User className="w-4 h-4 text-primary/70" />
                    Tenant ID
                  </label>
                  <input 
                    {...register('tenantId')}
                    placeholder="Enter user ID"
                    className={inputClasses}
                  />
                  {errors.tenantId && <p className="text-rose-500 text-xs mt-2 font-medium">{errors.tenantId.message}</p>}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 md:col-span-2 pt-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-white/5 pb-2">
                <Calendar className="w-5 h-5" />
                Lease Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClasses}>Start Date</label>
                  <input 
                    type="date"
                    {...register('startDate')}
                    className={inputClasses}
                  />
                  {errors.startDate && <p className="text-rose-500 text-xs mt-2 font-medium">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label className={labelClasses}>End Date</label>
                  <input 
                    type="date"
                    {...register('endDate')}
                    className={inputClasses}
                  />
                  {errors.endDate && <p className="text-rose-500 text-xs mt-2 font-medium">{errors.endDate.message}</p>}
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-8 md:col-span-2 pt-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-white/5 pb-2">
                <IndianRupee className="w-5 h-5" />
                Financial Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className={labelClasses}>Rent Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input 
                      type="number"
                      {...register('rentAmount', { valueAsNumber: true })}
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                  {errors.rentAmount && <p className="text-rose-500 text-xs mt-2 font-medium">{errors.rentAmount.message}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Security Deposit</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input 
                      type="number"
                      {...register('securityDeposit', { valueAsNumber: true })}
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                  {errors.securityDeposit && <p className="text-rose-500 text-xs mt-2 font-medium">{errors.securityDeposit.message}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    <Clock className="w-4 h-4 text-primary/70" />
                    Payment Frequency
                  </label>
                  <select 
                    {...register('paymentFrequency')}
                    className={inputClasses}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Agreement...
                </>
              ) : (
                <>
                  <FilePlus className="w-6 h-6" />
                  Finalize Lease Agreement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
