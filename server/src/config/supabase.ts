import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { env } from './env';

// Supabase configuration
const supabaseUrl = env.SUPABASE_URL || process.env['SUPABASE_URL'] || '';
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || process.env['SUPABASE_ANON_KEY'] || '';

// Create Supabase client for server-side operations (with service role key)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client for client-side operations (with anon key)
export const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Database connection using Supabase
export class SupabaseDatabase {
  private client: SupabaseClient;

  constructor(useServiceRole: boolean = true) {
    this.client = useServiceRole ? supabaseAdmin : supabaseClient;
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('count')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
        throw error;
      }
      
      logger.info('Supabase connection established successfully');
      return true;
    } catch (error) {
      logger.error('Failed to connect to Supabase:', error);
      return false;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: Date; details?: any }> {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('count')
        .limit(1);
      
      return {
        status: 'healthy',
        timestamp: new Date(),
        details: { connected: true }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        details: { error: error.message }
      };
    }
  }

  // User operations
  async createUser(userData: {
    id?: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    kyc_status?: string;
    is_active?: boolean;
    email_verified?: boolean;
    phone_verified?: boolean;
    two_factor_enabled?: boolean;
  }) {
    const { data, error } = await this.client
      .from('users')
      .insert([{
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByEmail(email: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getUserById(id: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUser(id: string, updates: any) {
    const { data, error } = await this.client
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Account operations
  async createAccount(accountData: {
    user_id: string;
    account_number: string;
    account_type: string;
    balance?: number;
    currency?: string;
    is_active?: boolean;
  }) {
    const { data, error } = await this.client
      .from('accounts')
      .insert([{
        ...accountData,
        balance: accountData.balance || 0,
        currency: accountData.currency || 'NGN',
        is_active: accountData.is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserAccounts(userId: string) {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  async getAccountByNumber(accountNumber: string) {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('account_number', accountNumber)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateAccountBalance(accountId: string, newBalance: number) {
    const { data, error } = await this.client
      .from('accounts')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Transaction operations
  async createTransaction(transactionData: {
    user_id: string;
    from_account_id?: string;
    to_account_id?: string;
    amount: number;
    currency: string;
    type: string;
    description?: string;
    reference: string;
    status?: string;
    metadata?: any;
  }) {
    const { data, error } = await this.client
      .from('transactions')
      .insert([{
        ...transactionData,
        status: transactionData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserTransactions(userId: string, limit: number = 50, offset: number = 0) {
    const { data, error } = await this.client
      .from('transactions')
      .select(`
        *,
        from_account:from_account_id(account_number, account_type),
        to_account:to_account_id(account_number, account_type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async updateTransactionStatus(transactionId: string, status: string, metadata?: any) {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (metadata) {
      updates.metadata = metadata;
    }

    const { data, error } = await this.client
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Notification operations
  async createNotification(notificationData: {
    user_id: string;
    type: string;
    priority: string;
    title: string;
    message: string;
    data?: any;
    action_url?: string;
  }) {
    const { data, error } = await this.client
      .from('notifications')
      .insert([{
        ...notificationData,
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0) {
    const { data, error } = await this.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await this.client
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Security operations
  async logSecurityEvent(eventData: {
    user_id?: string;
    ip_address: string;
    user_agent?: string;
    event_type: string;
    risk_level: string;
    event_data?: any;
    blocked?: boolean;
    block_reason?: string;
  }) {
    const { data, error } = await this.client
      .from('security_events')
      .insert([{
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Generic query method
  async query(tableName: string) {
    return this.client.from(tableName);
  }

  // Raw SQL execution (for complex queries)
  async rpc(functionName: string, params?: any) {
    const { data, error } = await this.client.rpc(functionName, params);
    if (error) throw error;
    return data;
  }
}

// Export singleton instance
export const supabaseDb = new SupabaseDatabase(true); // Use service role by default

// Export connection test function
export const testSupabaseConnection = async (): Promise<boolean> => {
  return await supabaseDb.testConnection();
};

// Export health check function
export const supabaseHealthCheck = async () => {
  return await supabaseDb.healthCheck();
};
