import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('investments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('account_id').references('id').inTable('accounts').onDelete('CASCADE');
    table.string('option_id').notNullable();
    table.string('option_name').notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.decimal('expected_return', 5, 2).notNullable(); // Percentage
    table.enum('risk_level', ['Low', 'Medium', 'High']).notNullable();
    table.enum('status', ['active', 'matured', 'withdrawn', 'cancelled']).defaultTo('active');
    table.date('start_date').notNullable();
    table.date('maturity_date');
    table.decimal('current_value', 15, 2);
    table.decimal('returns_earned', 15, 2).defaultTo(0);
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['account_id']);
    table.index(['status']);
    table.index(['start_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('investments');
}
