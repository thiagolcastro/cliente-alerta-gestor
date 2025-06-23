
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminUserManagement from '@/components/AdminUserManagement';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Sistema de Gerenciamento</h1>
        <AdminUserManagement />
      </div>
    </div>
  );
};

export default Index;
