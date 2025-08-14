import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').unique();
    table.date('date_of_birth');
    table.enum('account_type', ['personal', 'business', 'corporate', 'private']).notNullable();
    table.enum('kyc_status', ['pending', 'in_progress', 'approved', 'rejected', 'expired']).defaultTo('pending');
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.boolean('two_factor_enabled').defaultTo(false);
    table.string('two_factor_secret');
    table.timestamp('last_login');
    table.integer('failed_login_attempts').defaultTo(0);
    table.timestamp('locked_until');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['account_type']);
    table.index(['kyc_status']);
    table.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
