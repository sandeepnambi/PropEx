import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = '8+ chars, Upper, Lower & Special required';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Reset failed');
      }

      toast.success('Password updated successfully!');
      navigate('/auth/login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Registered Email
          </label>
          <input
            id="email"
            type="email"
            required
            className={`w-full px-4 py-3 bg-background border text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-600 ${
              errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'
            }`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            className={`w-full px-4 py-3 bg-background border text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-600 ${
              errors.newPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'
            }`}
            placeholder="Min 8 chars, Upper, Lower & Special"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
            }}
          />
          {errors.newPassword && <p className="mt-1 text-[10px] text-red-500 font-medium leading-tight">{errors.newPassword}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className={`w-full px-4 py-3 bg-background border text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-600 ${
              errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'
            }`}
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-gray-900 bg-primary hover:bg-primary-hover hover:shadow-[0_0_15px_rgba(223,166,89,0.3)] focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : 'Reset Password'}
        </button>
      </div>

      <div className="text-center mt-6 pt-6 border-t border-gray-800">
        <Link to="/auth/login" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
