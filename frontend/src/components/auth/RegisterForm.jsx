// frontend/src/components/auth/RegisterForm.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'Buyer',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        newErrors.phone = 'Please enter a valid 10-15 digit phone number';
      }
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, and a special character';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        const msg = result.error || 'Registration failed. Please try again.';
        setErrors(prev => ({
          ...prev,
          form: msg
        }));
        toast.error(msg);
      }
    } catch (err) {
      const msg = 'An error occurred during registration.';
      setErrors(prev => ({
        ...prev,
        form: msg
      }));
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className={`input-premium ${
              errors.firstName ? 'border-rose-500 ring-1 ring-rose-500' : ''
            }`}
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className={`input-premium ${
              errors.lastName ? 'border-rose-500 ring-1 ring-rose-500' : ''
            }`}
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`input-premium ${
            errors.email ? 'border-rose-500 ring-1 ring-rose-500' : ''
          }`}
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-500 font-bold">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
          Phone Number <span className="text-gray-600 font-medium">(Optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className={`input-premium ${
            errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : ''
          }`}
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
          I am a
        </label>
        <select
          id="role"
          name="role"
          className="input-premium appearance-none cursor-pointer"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Buyer">Buyer</option>
          <option value="Tenant">Tenant</option>
          <option value="Manager">Manager</option>
          <option value="Owner">Owner</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className={`input-premium ${
            errors.password ? 'border-rose-500 ring-1 ring-rose-500' : ''
          }`}
          placeholder="Min 8 chars, Upper, Lower & Special"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-rose-500 font-bold uppercase tracking-tighter leading-tight">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className={`input-premium ${
            errors.confirmPassword ? 'border-rose-500 ring-1 ring-rose-500' : ''
          }`}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-rose-500 font-bold">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-gray-900 bg-primary hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(223,166,89,0.3)] focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Create Account
            </span>
          )}
        </button>
      </div>
      
    </form>
  );
};

export default RegisterForm;
