
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import PublicHomePage from '@/components/PublicHomePage';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700">Carregando...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show admin dashboard
  if (user) {
    return <AdminDashboard />;
  }

  // If not authenticated, show public homepage
  return <PublicHomePage />;
};

export default Index;
