-- Add role column to users table
ALTER TABLE users ADD role TEXT DEFAULT 'user';

-- Set admin role for admin users  
UPDATE users SET role = 'admin' WHERE email = 'admin-test@ubasfintrust.com';
