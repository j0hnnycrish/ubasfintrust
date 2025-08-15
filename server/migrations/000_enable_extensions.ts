import type { Knex } from 'knex';

// Ensure required PostgreSQL extensions are available before other migrations run.
// gen_random_uuid() requires the pgcrypto extension. Some environments also prefer uuid-ossp.
export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

export async function down(knex: Knex): Promise<void> {
  // Do not drop extensions in down to avoid breaking other objects that may depend on them.
}
