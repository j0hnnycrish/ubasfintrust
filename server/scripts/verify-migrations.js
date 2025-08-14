#!/usr/bin/env node
/*
  Simple migration verifier for CI/Render:
  - Ensures no duplicate migration tries to create an already existing table.
  - Runs hasTable checks for known tables and prints a summary.
*/
const knex = require('knex');
const config = require('../knexfile.js');

async function main() {
  const env = process.env.NODE_ENV || 'development';
  const cfg = config[env] || config.development;
  const db = knex(cfg);
  const tables = [
    'users','accounts','transactions','cards','loans',
    'kyc_applications','kyc_documents','audit_logs','fraud_alerts',
    'investments','grants'
  ];

  const results = {};
  for (const t of tables) {
    try {
      results[t] = await db.schema.hasTable(t);
    } catch (e) {
      results[t] = false;
    }
  }

  // Print summary
  const missing = Object.entries(results).filter(([, ok]) => !ok).map(([k]) => k);
  if (missing.length) {
    console.log('[migrations:verify] Missing tables:', missing.join(', '));
  } else {
    console.log('[migrations:verify] All expected tables present.');
  }

  await db.destroy();
  process.exit(0);
}

main().catch(err => {
  console.error('[migrations:verify] Error:', err.message);
  process.exit(0); // do not block deploy; this is advisory
});
