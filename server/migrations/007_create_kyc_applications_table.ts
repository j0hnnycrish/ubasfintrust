import type { Knex } from 'knex';

// This migration was a duplicate of 006_create_kyc_applications_table.
// Make it a no-op to avoid "relation already exists" errors on redeploys.
export async function up(_knex: Knex): Promise<void> {
  return; // intentionally empty
}

export async function down(_knex: Knex): Promise<void> {
  return; // intentionally empty
}
