import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserPlus
} from 'lucide-react';

export function CustomerManagement() {
  const { customers, customerMeta, setCustomerSearch, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useAdmin();
  const [searchTerm, setSearchTerm] = useState(customerMeta.search || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    accountType: 'personal' as 'personal' | 'business' | 'corporate' | 'private',
    password: '',
  confirmPassword: '',
  sendWelcomeEmail: true,
  sendWelcomeSms: false,
  welcomeEmailTemplateId: '',
  welcomeSmsTemplateId: ''
  });

  // With server-side search, display customers as-is (already filtered). Fallback local filter if no server search applied.
  const filteredCustomers = searchTerm ? customers : customers;

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      phoneNumber: '',
      accountType: 'personal',
      password: '',
      confirmPassword: '',
      sendWelcomeEmail: true,
      sendWelcomeSms: false,
      welcomeEmailTemplateId: '',
      welcomeSmsTemplateId: ''
    });
    setError('');
    setSuccess('');
    setEditingCustomer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validation
    if (!formData.username || !formData.email || !formData.fullName) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (!editingCustomer && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingCustomer) {
        // Update existing customer
        const result = await updateCustomer(editingCustomer.id, {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          accountType: formData.accountType
        });

        if (result.success) {
          setSuccess('Customer updated successfully');
          setEditingCustomer(null);
          setShowCreateModal(false);
          resetForm();
        } else {
          setError(result.error || 'Failed to update customer');
        }
      } else {
        // Create new customer
        const result = await createCustomer({
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          accountType: formData.accountType,
          sendWelcomeEmail: formData.sendWelcomeEmail,
          sendWelcomeSms: formData.sendWelcomeSms,
          welcomeEmailTemplateId: formData.welcomeEmailTemplateId || undefined,
          welcomeSmsTemplateId: formData.welcomeSmsTemplateId || undefined
        } as any);

        if (result.success) {
          setSuccess('Customer created successfully');
          setShowCreateModal(false);
          resetForm();
        } else {
          setError(result.error || 'Failed to create customer');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (customer: any) => {
    setFormData(prev => ({
      ...prev,
      username: customer.username,
      email: customer.email,
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      accountType: customer.accountType,
      password: '',
      confirmPassword: ''
    }));
    setEditingCustomer(customer);
    setShowCreateModal(true);
  };

  const handleDelete = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        setSuccess('Customer deleted successfully');
      } else {
        setError(result.error || 'Failed to delete customer');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage customer accounts and information</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Edit Customer' : 'Create New Customer'}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Update customer information' : 'Add a new customer to the system'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="john.doe"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label>Welcome Email</Label>
                  <div className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={formData.sendWelcomeEmail} onChange={e=>setFormData(p=>({...p, sendWelcomeEmail: e.target.checked}))} />
                    <span>Send welcome email</span>
                  </div>
                  <Input placeholder="Email Template ID (optional)" value={formData.welcomeEmailTemplateId} onChange={e=>setFormData(p=>({...p,welcomeEmailTemplateId:e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Welcome SMS</Label>
                  <div className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={formData.sendWelcomeSms} onChange={e=>setFormData(p=>({...p, sendWelcomeSms: e.target.checked}))} />
                    <span>Send welcome SMS</span>
                  </div>
                  <Input placeholder="SMS Template ID (optional)" value={formData.welcomeSmsTemplateId} onChange={e=>setFormData(p=>({...p,welcomeSmsTemplateId:e.target.value}))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1-555-0123"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select 
                    value={formData.accountType} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, accountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!editingCustomer && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm password"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCustomer ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {editingCustomer ? 'Update Customer' : 'Create Customer'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers by name, email, or username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCustomerSearch(e.target.value);
                // debounce fetch minimal (simple timeout)
                window.clearTimeout((window as any)._custSearchTimer);
                (window as any)._custSearchTimer = setTimeout(()=>fetchCustomers(1, customerMeta.limit), 400);
              }}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({customerMeta.total || filteredCustomers.length})</CardTitle>
          <CardDescription>All registered customers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{customer.fullName}</h4>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-xs text-gray-400">@{customer.username} • {customer.accountNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex space-x-2 mb-1">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <Badge className={getKycStatusColor(customer.kycStatus)}>
                        KYC: {customer.kycStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {customer.accounts.length} account(s) • Joined {customer.createdAt}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first customer'}
                </p>
              </div>
            )}
            {/* Pagination Controls */}
            {customerMeta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">Page {customerMeta.page} of {customerMeta.totalPages} • {customerMeta.total} total</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={customerMeta.page<=1} onClick={()=>fetchCustomers(customerMeta.page-1, customerMeta.limit)}>Prev</Button>
                  <Button variant="outline" size="sm" disabled={customerMeta.page>=customerMeta.totalPages} onClick={()=>fetchCustomers(customerMeta.page+1, customerMeta.limit)}>Next</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
