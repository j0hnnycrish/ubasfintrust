import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPortal() {
  const { isAdminAuthenticated } = useAdmin();

  return (
    <div>
      {isAdminAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
}
