import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users: onboarding flags
  const hasUsers = await knex.schema.hasTable('users');
  if (hasUsers) {
    const hasOnboardingCompleted = await knex.schema.hasColumn('users', 'onboarding_completed');
    if (!hasOnboardingCompleted) {
      await knex.schema.alterTable('users', table => {
        table.boolean('onboarding_completed').notNullable().defaultTo(false);
        table.timestamp('onboarding_completed_at');
        table.integer('onboarding_version').notNullable().defaultTo(1);
      });
    }
  }

  // Message / template storage
  const existsTemplates = await knex.schema.hasTable('message_templates');
  if (!existsTemplates) {
    await knex.schema.createTable('message_templates', table => {
      table.uuid('id').primary();
      table.string('type').notNullable(); // e.g. welcome_email, welcome_sms, onboarding_step
      table.string('channel').notNullable(); // email | sms | in_app
      table.string('locale').notNullable().defaultTo('en');
      table.string('name').notNullable();
      table.string('subject'); // email subject
      table.text('body').notNullable(); // templated body (can contain handlebars style {{variable}})
      table.integer('step_order'); // for onboarding steps
      table.string('icon');
      table.boolean('is_default').notNullable().defaultTo(false);
      table.integer('version').notNullable().defaultTo(1);
      table.timestamps(true, true);
    });

    // Seed default onboarding steps (5) and welcome templates
    await knex('message_templates').insert([
      { id: knex.raw('gen_random_uuid()'), type: 'onboarding_step', channel: 'in_app', locale: 'en', name: 'welcome_step_1', subject: null, body: 'Secure global banking with multi-channel protection.', step_order: 1, icon: 'shield', is_default: true },
      { id: knex.raw('gen_random_uuid()'), type: 'onboarding_step', channel: 'in_app', locale: 'en', name: 'welcome_step_2', subject: null, body: 'Manage accounts: balances, activity, and real-time insights.', step_order: 2, icon: 'wallet', is_default: true },
      { id: knex.raw('gen_random_uuid()'), type: 'onboarding_step', channel: 'in_app', locale: 'en', name: 'welcome_step_3', subject: null, body: 'Execute internal & international transfers with smart routing.', step_order: 3, icon: 'globe', is_default: true },
      { id: knex.raw('gen_random_uuid()'), type: 'onboarding_step', channel: 'in_app', locale: 'en', name: 'welcome_step_4', subject: null, body: 'Advanced security: 2FA, anomaly detection, audit trails.', step_order: 4, icon: 'lock', is_default: true },
      { id: knex.raw('gen_random_uuid()'), type: 'onboarding_step', channel: 'in_app', locale: 'en', name: 'welcome_step_5', subject: null, body: 'Notifications & analytics keep you informed proactively.', step_order: 5, icon: 'bell', is_default: true },
      { id: knex.raw('gen_random_uuid()'), type: 'welcome_email', channel: 'email', locale: 'en', name: 'welcome_email_default', subject: 'Welcome to UBAS Financial Trust', body: 'Hello {{firstName}}, your account is ready. Start exploring secure global banking today.', is_default: true },
      { id: knex.raw('gen_random_uuid()'), type: 'welcome_sms', channel: 'sms', locale: 'en', name: 'welcome_sms_default', subject: null, body: 'UBAS: Your account is active. Log in & complete onboarding for full features.', is_default: true }
    ]);
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasUsers = await knex.schema.hasTable('users');
  if (hasUsers) {
    const hasOnboardingCompleted = await knex.schema.hasColumn('users', 'onboarding_completed');
    if (hasOnboardingCompleted) {
      await knex.schema.alterTable('users', table => {
        table.dropColumn('onboarding_completed');
        table.dropColumn('onboarding_completed_at');
        table.dropColumn('onboarding_version');
      });
    }
  }
  const existsTemplates = await knex.schema.hasTable('message_templates');
  if (existsTemplates) {
    await knex.schema.dropTable('message_templates');
  }
}
