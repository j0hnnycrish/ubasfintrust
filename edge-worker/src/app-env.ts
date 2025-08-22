
export interface Env {
  DB: any;
  JWT_SECRET: string;
  JWT_AUD?: string;
  DATABASE_URL?: string;
  SENDGRID_API_KEY?: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  RESEND_API?: string;
  VONAGE_API_KEY?: string;
  VONAGE_API_SECRET?: string;
  TEXTBELT_API_KEY?: string;
  DEV_MINT?: string;
  APP_KV?: any;
}
