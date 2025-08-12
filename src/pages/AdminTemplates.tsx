import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { TemplatesManager } from '@/components/admin/TemplatesManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function AdminTemplates() {
  const { adminUser } = useAdmin();

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Please sign in to the admin portal to manage templates.</p>
            <Button onClick={() => (window.location.href = '/admin')} className="bg-red-600 hover:bg-red-700">
              <Shield className="mr-2 h-4 w-4" /> Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-700">Templates</h1>
        <TemplatesManager />
      </div>
    </div>
  );
}

