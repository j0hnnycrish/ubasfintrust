import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('grants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('account_id').references('id').inTable('accounts').onDelete('CASCADE').notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('currency', 3).defaultTo('USD');
    table.text('purpose').notNullable();
    table.enum('status', ['pending','approved','rejected','cancelled']).defaultTo('approved');
    table.jsonb('metadata');
    table.timestamp('approved_at');
    table.timestamps(true, true);

    table.index(['user_id']);
    table.index(['account_id']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('grants');
}
