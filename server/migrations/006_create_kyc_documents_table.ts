import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('kyc_documents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('kyc_application_id').references('id').inTable('kyc_applications').onDelete('CASCADE');
    table.string('document_type').notNullable(); // primaryId, proofOfAddress, incomeProof, etc.
    table.string('document_number');
    table.string('file_path').notNullable();
    table.string('file_name').notNullable();
    table.integer('file_size');
    table.string('mime_type');
    table.enum('verification_status', ['pending', 'verified', 'rejected']).defaultTo('pending');
    table.timestamp('verified_at');
    table.text('rejection_reason');
    table.timestamps(true, true);

    // Indexes
    table.index(['user_id']);
    table.index(['kyc_application_id']);
    table.index(['document_type']);
    table.index(['verification_status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('kyc_documents');
}
