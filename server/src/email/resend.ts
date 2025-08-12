import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEventEmail({
  to,
  subject,
  html,
  type = 'notification',
}) {
  // Choose sender based on type
  const from = type === 'alert'
    ? 'alerts@ubasfintrust.com'
    : 'noreply@ubasfintrust.com';

  return await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}

