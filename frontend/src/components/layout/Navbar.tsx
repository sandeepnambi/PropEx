// frontend/src/components/layout/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout, role, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getNavLinks = () => {
    if (!isLoggedIn) {
      return [
        { name: 'Buy', to: '/listings?intent=buy' },
        { name: 'Rent', to: '/listings?intent=rent' },
        { name: 'Sell', to: '/sell' },
        { name: 'About', to: '/about' },
      ];
    }

    switch (role) {
      case 'Admin':
        return [
          { name: 'Users', to: '/admin?tab=users' },
          { name: 'Listings', to: '/admin?tab=listings' },
          { name: 'Analytics', to: '/admin/analytics' },
        ];
      case 'Manager':
      case 'Owner':
        return [
          { name: 'Sell', to: '/sell' },
          { name: 'About', to: '/about' },
          { name: 'My Dashboard', to: '/dashboard' },
        ];
      case 'Buyer':
        return [
          { name: 'Buy', to: '/listings?intent=buy' },
          { name: 'About', to: '/about' },
          { name: 'My Dashboard', to: '/buyer-dashboard' },
        ];
      case 'Tenant':
        return [
          { name: 'Rent', to: '/listings?intent=rent' },
          { name: 'About', to: '/about' },
          { name: 'My Lease', to: '/tenant-dashboard' },
        ];
      default:
        return [
          { name: 'About', to: '/about' },
        ];
    }
  };

  const navLinks = getNavLinks();

  const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname + location.search === to;
    return (
      <Link
        to={to}
        className={`relative group px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'
          }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {children}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`} />
      </Link>
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled || isMenuOpen
      ? 'bg-background/95 backdrop-blur-lg border-white/5 shadow-xl'
      : 'bg-background/50 backdrop-blur-sm border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            {isLoggedIn && ['Admin', 'Manager', 'Owner'].includes(role || '') ? (
              <div className="text-2xl font-black tracking-tighter flex items-center cursor-default">
                <span className="text-primary">Prop</span>
                <span className="text-white">Ex</span>
              </div>
            ) : (
              <Link to="/" className="text-2xl font-black tracking-tighter flex items-center group">
                <span className="text-primary group-hover:text-yellow-200 transition-colors duration-300">Prop</span>
                <span className="text-white">Ex</span>
              </Link>
            )}
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavItem key={link.name} to={link.to}>{link.name}</NavItem>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all duration-300 group"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/30">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-200 text-sm font-semibold group-hover:text-white transition-colors">
                    {user?.firstName}
                  </span>
                </Link>
                
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-gray-900 transition-all duration-300 bg-primary rounded-full hover:bg-primary-hover hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(223,166,89,0.3)] overflow-hidden group"
              >
                <span className="relative z-10 text-sm">Sign In / Register</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-primary transition-colors focus:outline-none"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
        }`}>
        <div className="bg-surface/95 backdrop-blur-xl border-b border-white/5 px-6 pt-4 pb-8 space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="block text-lg font-semibold text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/5">
            {isLoggedIn ? (
              <div className="space-y-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 text-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-primary">{role}</p>
                  </div>
                </Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full text-center py-3 bg-red-900/20 text-red-400 rounded-xl font-bold border border-red-900/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block w-full text-center py-3.5 bg-primary text-gray-900 font-bold rounded-full shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;