// frontend/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import PropertyDetails from './pages/PropertyDetails';
import AuthPage from './pages/AuthPage';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import TenantDashboard from './pages/TenantDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SellPage from './pages/SellPage';
import AgentsPage from './pages/AgentsPage';
import AboutPage from './pages/AboutPage';
import Analytics from './pages/admin/Analytics';
import CreateLease from './pages/leases/CreateLease';
import LeaseDetails from './pages/leases/LeaseDetails';
import ProtectedRoute from './components/utils/ProtectedRoute';
import type { UserRole } from './types';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E1E1E',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#DFA659',
              secondary: '#1E1E1E',
            },
          },
        }}
      />
      {/* The Navbar component needs to be created in src/components/layout/Navbar.tsx */}
      <Navbar />
      <main className="flex-grow pt-24 pb-8 px-4 md:px-8 bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingPage />} />
          <Route path="/listings/:id" element={<PropertyDetails />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth">
            <Route index element={<AuthPage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="register" element={<AuthPage />} />
            <Route path="forgot-password" element={<AuthPage />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Owner'] as UserRole[]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin'] as UserRole[]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['Admin'] as UserRole[]}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['Buyer', 'Admin', 'Tenant', 'Manager', 'Owner'] as UserRole[]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Buyer'] as UserRole[]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Tenant'] as UserRole[]}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Lease Management Routes - Note: Removed main /leases route as per user request */}
          <Route
            path="/leases/create"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager'] as UserRole[]}>
                <CreateLease />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leases/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Tenant'] as UserRole[]}>
                <LeaseDetails />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<h1 className='text-3xl text-center pt-20'>404: Not Found</h1>} />
        </Routes>
      </main>

      {/* The Footer component needs to be created in src/components/layout/Footer.tsx */}
      <Footer />
    </div>
  );
}

export default App;