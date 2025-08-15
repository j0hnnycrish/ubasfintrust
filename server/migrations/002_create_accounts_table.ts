import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('account_number').unique().notNullable();
    table.enum('account_type', ['checking', 'savings', 'business', 'investment', 'loan']).notNullable();
    table.decimal('balance', 15, 2).defaultTo(0);
    table.decimal('available_balance', 15, 2).defaultTo(0);
  table.string('currency', 3).defaultTo('USD');
    table.enum('status', ['active', 'inactive', 'suspended', 'closed']).defaultTo('active');
    table.decimal('interest_rate', 5, 2);
    table.decimal('overdraft_limit', 15, 2).defaultTo(0);
    table.decimal('minimum_balance', 15, 2).defaultTo(0);
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['account_number']);
    table.index(['account_type']);
    table.index(['status']);
    table.index(['currency']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts');
}
