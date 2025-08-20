-- KYC tables for document verification system
-- Safe to apply multiple times; uses IF NOT EXISTS

-- KYC applications table
CREATE TABLE IF NOT EXISTS kyc_applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  personal_firstName TEXT NOT NULL,
  personal_lastName TEXT NOT NULL,
  personal_dateOfBirth TEXT NOT NULL,
  personal_nationality TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_country TEXT NOT NULL,
  employment_status TEXT NOT NULL,
  employment_monthlyIncome REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  reviewed_by TEXT,
  rejection_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- KYC documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kyc_application_id TEXT NOT NULL REFERENCES kyc_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending',
  verified_at TEXT,
  verified_by TEXT,
  rejection_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- KYC indices for performance
CREATE INDEX IF NOT EXISTS idx_kyc_apps_user ON kyc_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_apps_status ON kyc_applications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_user ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_app ON kyc_documents(kyc_application_id);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_status ON kyc_documents(verification_status);
