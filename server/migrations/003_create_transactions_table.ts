import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('from_account_id').references('id').inTable('accounts').onDelete('SET NULL');
    table.uuid('to_account_id').references('id').inTable('accounts').onDelete('SET NULL');
    table.decimal('amount', 15, 2).notNullable();
    table.string('currency', 3).notNullable();
    table.enum('type', ['transfer', 'deposit', 'withdrawal', 'payment', 'fee', 'interest', 'loan_payment', 'card_payment']).notNullable();
    table.enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']).defaultTo('pending');
    table.text('description');
    table.string('reference').unique().notNullable();
    table.string('category');
    table.jsonb('metadata');
    table.decimal('fee_amount', 15, 2).defaultTo(0);
    table.decimal('exchange_rate', 10, 6);
    table.string('external_reference');
    table.timestamp('processed_at');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['from_account_id']);
    table.index(['to_account_id']);
    table.index(['type']);
    table.index(['status']);
    table.index(['reference']);
    table.index(['created_at']);
    table.index(['processed_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
