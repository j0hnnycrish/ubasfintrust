require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'provi_banking',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: (process.env.DB_NAME || 'provi_banking') + '_test',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'postgresql',
    // Ensure SSL for Supabase (requires sslmode=require)
    connection: (() => {
      if (process.env.DATABASE_URL) {
        // Append sslmode=require if not already present
        if (!/sslmode=/.test(process.env.DATABASE_URL)) {
          const joinChar = process.env.DATABASE_URL.includes('?') ? '&' : '?';
          return process.env.DATABASE_URL + joinChar + 'sslmode=require';
        }
        return process.env.DATABASE_URL;
      }
      return {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
      };
    })(),
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
