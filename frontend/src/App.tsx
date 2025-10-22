// frontend/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import PropertyDetails from './pages/PropertyDetails';
import AuthPage from './pages/AuthPage';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/utils/ProtectedRoute';
import type { UserRole } from '@/types';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* The Navbar component needs to be created in src/components/layout/Navbar.tsx */}
      <Navbar /> 
      <main className="flex-grow p-4 md:p-8 bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingPage />} />
          <Route path="/listings/:id" element={<PropertyDetails />} />
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
              <ProtectedRoute allowedRoles={['Agent', 'Admin'] as UserRole[]}>
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