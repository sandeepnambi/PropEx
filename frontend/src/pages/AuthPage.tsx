import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/auth/login' || location.pathname === '/auth';
  const isForgot = location.pathname === '/auth/forgot-password';

  const getTitle = () => {
    if (isForgot) return 'Reset Password';
    return isLogin ? 'Welcome Back' : 'Create Account';
  };

  const getDescription = () => {
    if (isForgot) return 'Enter your email to set a new password';
    return isLogin ? 'Sign in to continue to your account' : 'Join our community of home seekers';
  };

  const renderForm = () => {
    if (isForgot) return <ForgotPasswordForm />;
    return isLogin ? <LoginForm /> : <RegisterForm />;
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop" 
            alt="Beautiful contemporary apartment" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <div className="max-w-md animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 leading-tight">Find exactly what you've been looking for.</h2>
            <p className="text-lg text-gray-300">
              Join thousands of agents and home seekers finding their perfect match on PropEx.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-surface rounded-3xl shadow-professional p-8 sm:p-12 border border-gray-800 relative">
            
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {getTitle()}
              </h2>
              <p className="text-gray-400">
                {getDescription()}
              </p>
            </div>
            
            {renderForm()}
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <Link to={isLogin ? '/auth/register' : '/auth/login'} className="ml-2 font-bold text-primary hover:text-primary-hover transition-colors">
                  {isLogin ? 'Sign up' : 'Log in'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
