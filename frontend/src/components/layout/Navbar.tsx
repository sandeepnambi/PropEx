// frontend/src/components/layout/Navbar.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout, role, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const getDashboardLink = () => {
    if (role === 'Admin') return '/admin';
    if (role === 'Agent') return '/dashboard';
    return '/'; // Fallback for Buyer/default role
  }

  const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <Link 
      to={to} 
      className="block px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 md:text-sm md:inline-block md:ml-2"
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo/Brand */}
          <Link to="/" className="text-3xl font-bold hover:scale-105 transition-transform duration-200">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Prop</span>
            <span className="text-gray-900">Ex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <NavItem to="/listings">Browse Listings</NavItem>
            {isLoggedIn && (role === 'Agent' || role === 'Admin') && (
                <NavItem to={getDashboardLink()}>
                    {role === 'Admin' ? 'Admin Panel' : 'Agent Dashboard'}
                </NavItem>
            )}
            
            {isLoggedIn ? (
              <div className="ml-4 flex items-center space-x-4">
                {/* Professional user greeting based on role */}
                <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 text-sm font-medium">
                      Hello, {user?.firstName} {user?.lastName}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <NavItem to="/listings">Browse Listings</NavItem>
          {isLoggedIn && (role === 'Agent' || role === 'Admin') && (
                <NavItem to={getDashboardLink()}>
                    {role === 'Admin' ? 'Admin Panel' : 'Agent Dashboard'}
                </NavItem>
          )}
          {isLoggedIn ? (
            <>
              <div className="px-3 py-2 text-base font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <span>Hello, {user?.firstName} {user?.lastName}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="w-full text-left px-3 py-2 bg-red-500 text-white rounded-md text-base hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <NavItem to="/auth">Sign In / Register</NavItem>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;