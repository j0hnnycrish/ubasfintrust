import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('kyc_documents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('document_type').notNullable(); // passport, drivers_license, national_id, etc.
    table.string('document_number').notNullable();
    table.string('file_path').notNullable();
    table.enum('verification_status', ['pending', 'verified', 'rejected']).defaultTo('pending');
    table.timestamp('verified_at');
    table.text('rejection_reason');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['document_type']);
    table.index(['verification_status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('kyc_documents');
}
