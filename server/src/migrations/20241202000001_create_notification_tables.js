/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    // Notification preferences table
    knex.schema.createTable('notification_preferences', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('email').defaultTo(true);
      table.boolean('sms').defaultTo(true);
      table.boolean('push').defaultTo(true);
      table.boolean('in_app').defaultTo(true);
      table.boolean('transaction_email').defaultTo(true);
      table.boolean('transaction_sms').defaultTo(true);
      table.boolean('security_email').defaultTo(true);
      table.boolean('security_sms').defaultTo(true);
      table.boolean('account_email').defaultTo(true);
      table.boolean('account_sms').defaultTo(false);
      table.boolean('system_email').defaultTo(false);
      table.boolean('system_sms').defaultTo(false);
      table.boolean('marketing_email').defaultTo(false);
      table.boolean('marketing_sms').defaultTo(false);
      table.timestamps(true, true);
      
      table.unique('user_id');
      table.index('user_id');
    }),

    // Notification events table (for tracking all notification events)
    knex.schema.createTable('notification_events', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.enum('type', ['transaction', 'security', 'account', 'system', 'marketing']).notNullable();
      table.enum('priority', ['low', 'medium', 'high', 'critical']).notNullable();
      table.string('title').notNullable();
      table.text('message').notNullable();
      table.jsonb('data');
      table.jsonb('channels'); // Array of channels: ['email', 'sms', 'push', 'in_app']
      table.timestamp('scheduled_for');
      table.timestamps(true, true);
      
      table.index(['user_id', 'created_at']);
      table.index(['type', 'created_at']);
      table.index('priority');
    }),

    // Notification logs table (for tracking delivery attempts)
    knex.schema.createTable('notification_logs', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.uuid('event_id').notNullable().references('id').inTable('notification_events').onDelete('CASCADE');
      table.string('channel').notNullable(); // email, sms, push, in_app
      table.string('provider').notNullable(); // SMTP, SendGrid, Twilio, etc.
      table.enum('status', ['pending', 'sent', 'failed', 'retry']).notNullable();
      table.integer('attempts').defaultTo(1);
      table.timestamp('last_attempt').notNullable();
      table.text('error');
      table.jsonb('metadata'); // Provider-specific response data
      table.timestamps(true, true);
      
      table.index(['user_id', 'created_at']);
      table.index(['event_id', 'channel']);
      table.index(['status', 'last_attempt']);
      table.index('provider');
    }),

    // In-app notifications table (for notifications displayed in the app)
    knex.schema.createTable('notifications', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.enum('type', ['transaction', 'security', 'account', 'system', 'marketing']).notNullable();
      table.enum('priority', ['low', 'medium', 'high', 'critical']).notNullable();
      table.string('title').notNullable();
      table.text('message').notNullable();
      table.jsonb('data');
      table.string('action_url');
      table.boolean('read').defaultTo(false);
      table.timestamp('read_at');
      table.timestamps(true, true);
      
      table.index(['user_id', 'read', 'created_at']);
      table.index(['type', 'created_at']);
      table.index('priority');
    }),

    // Provider health status table
    knex.schema.createTable('provider_health', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('provider_name').notNullable();
      table.string('provider_type').notNullable(); // email, sms
      table.boolean('is_healthy').defaultTo(true);
      table.text('last_error');
      table.timestamp('last_check').notNullable();
      table.integer('consecutive_failures').defaultTo(0);
      table.timestamps(true, true);
      
      table.unique(['provider_name', 'provider_type']);
      table.index('provider_type');
      table.index(['is_healthy', 'last_check']);
    }),

    // Notification templates table (for customizable email/SMS templates)
    knex.schema.createTable('notification_templates', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable().unique();
      table.enum('type', ['transaction', 'security', 'account', 'system', 'marketing']).notNullable();
      table.string('channel').notNullable(); // email, sms
      table.string('subject'); // For email templates
      table.text('template').notNullable(); // Template with placeholders
      table.jsonb('variables'); // Available template variables
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
      
      table.index(['type', 'channel']);
      table.index('is_active');
    }),

    // Notification queue table (for scheduled and retry notifications)
    knex.schema.createTable('notification_queue', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('event_id').notNullable().references('id').inTable('notification_events').onDelete('CASCADE');
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('channel').notNullable();
      table.enum('status', ['pending', 'processing', 'completed', 'failed']).defaultTo('pending');
      table.integer('attempts').defaultTo(0);
      table.integer('max_attempts').defaultTo(3);
      table.timestamp('scheduled_for').notNullable();
      table.timestamp('next_retry');
      table.text('last_error');
      table.jsonb('payload'); // Notification data
      table.timestamps(true, true);
      
      table.index(['status', 'scheduled_for']);
      table.index(['user_id', 'created_at']);
      table.index('event_id');
    })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('notification_queue'),
    knex.schema.dropTableIfExists('notification_templates'),
    knex.schema.dropTableIfExists('provider_health'),
    knex.schema.dropTableIfExists('notifications'),
    knex.schema.dropTableIfExists('notification_logs'),
    knex.schema.dropTableIfExists('notification_events'),
    knex.schema.dropTableIfExists('notification_preferences')
  ]);
};
