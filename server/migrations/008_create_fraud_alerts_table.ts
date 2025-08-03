import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fraud_alerts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('transaction_id').references('id').inTable('transactions').onDelete('SET NULL');
    table.integer('risk_score').notNullable();
    table.enum('risk_level', ['low', 'medium', 'high', 'critical']).notNullable();
    table.jsonb('reasons').notNullable();
    table.jsonb('metadata');
    table.enum('status', ['pending', 'investigating', 'resolved', 'false_positive']).defaultTo('pending');
    table.uuid('assigned_to').references('id').inTable('users').onDelete('SET NULL');
    table.text('resolution_notes');
    table.timestamp('resolved_at');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['transaction_id']);
    table.index(['risk_level']);
    table.index(['status']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('fraud_alerts');
}
