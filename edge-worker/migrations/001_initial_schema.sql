-- Initial schema for D1 (SQLite)

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    password_hash TEXT,
    role TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Add other tables and schema as needed
