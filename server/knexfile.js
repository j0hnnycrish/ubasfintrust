require('dotenv').config();
// Enable TypeScript support for migration/seed files when running via CLI
try {
  require('ts-node').register({ transpileOnly: true });
} catch (e) {
  // ts-node may not be present in some environments; migrations should be compiled or ts-node installed
}

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
    // Ensure SSL in production; Node-postgres ignores sslmode in URL, so set ssl explicitly
    connection: (() => {
      if (process.env.DATABASE_URL) {
        return {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        };
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
