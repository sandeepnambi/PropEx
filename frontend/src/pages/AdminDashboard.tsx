// frontend/src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Users, Home as HomeIcon, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminListingModeration from '../components/admin/AdminListingModeration';

type AdminTab = 'users' | 'listings';

const AdminDashboard = () => {
  const { user, isLoading, role } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not admin or still loading
    if (!isLoading && role !== 'Admin') {
      navigate('/');
    }
  }, [isLoading, role, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role !== 'Admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: LucideIcon }[] = [
    {
      id: 'users',
      label: 'User Management',
      icon: Users
    },
    {
      id: 'listings',
      label: 'Listing Moderation',
      icon: HomeIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage users, moderate content, and maintain system integrity.
          </p>
        </header>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'users' && <AdminUserManagement />}
            {activeTab === 'listings' && <AdminListingModeration />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;