import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, setError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Must be 8+ characters with uppercase, lowercase, and a special character';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Call the login function from AuthContext
      login(data.token, data.data.user);
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      const userRole = data.data.user.role;
      if (['Admin', 'Manager', 'Owner'].includes(userRole)) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-2">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={`w-full px-4 py-3 bg-background border text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-600 ${
              errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-800'
            }`}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
          />
          {errors.password && <p className="mt-1 text-[10px] text-red-500 font-medium leading-tight">{errors.password}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link to="/auth/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Forgot your password?
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-gray-900 bg-primary hover:shadow-[0_0_15px_rgba(223,166,89,0.3)] hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 transform hover:scale-105 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Sign In
            </>
          )}
        </button>
      </div>
      
    </form>
  );
};

export default LoginForm;
