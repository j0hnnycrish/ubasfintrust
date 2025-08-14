import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('kyc_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', ['pending', 'in_progress', 'approved', 'rejected', 'expired']).defaultTo('pending');
    table.jsonb('personal_info').notNullable();
    table.jsonb('address_info').notNullable();
    table.jsonb('employment_info').notNullable();
    table.timestamp('submitted_at').notNullable();
    table.timestamp('reviewed_at');
    table.uuid('reviewed_by').references('id').inTable('users');
    table.text('rejection_reason');
    table.text('admin_notes');
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['status']);
    table.index(['submitted_at']);
    table.index(['reviewed_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('kyc_applications');
}

