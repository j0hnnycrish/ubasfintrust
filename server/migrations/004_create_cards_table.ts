import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cards', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account_id').references('id').inTable('accounts').onDelete('CASCADE');
    table.string('card_number').unique().notNullable();
    table.enum('card_type', ['debit', 'credit', 'prepaid']).notNullable();
    table.enum('status', ['active', 'inactive', 'blocked', 'expired']).defaultTo('active');
    table.date('expiry_date').notNullable();
    table.string('cvv_hash').notNullable();
    table.decimal('daily_limit', 15, 2).defaultTo(100000);
    table.decimal('monthly_limit', 15, 2).defaultTo(1000000);
    table.boolean('is_contactless').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index(['account_id']);
    table.index(['card_number']);
    table.index(['card_type']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('cards');
}
