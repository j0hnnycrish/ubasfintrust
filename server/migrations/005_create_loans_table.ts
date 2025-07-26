import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('loans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('loan_type', ['personal', 'mortgage', 'auto', 'business', 'student']).notNullable();
    table.decimal('principal_amount', 15, 2).notNullable();
    table.decimal('interest_rate', 5, 2).notNullable();
    table.integer('term_months').notNullable();
    table.decimal('monthly_payment', 15, 2).notNullable();
    table.decimal('outstanding_balance', 15, 2).notNullable();
    table.enum('status', ['pending', 'approved', 'disbursed', 'active', 'paid_off', 'defaulted']).defaultTo('pending');
    table.text('purpose');
    table.text('collateral');
    table.timestamp('approved_at');
    table.timestamp('disbursed_at');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['loan_type']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('loans');
}
