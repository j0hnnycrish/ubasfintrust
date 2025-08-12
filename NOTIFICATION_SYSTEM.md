# Event-Based Notifications System

## Overview

This comprehensive notification system provides multi-channel event-based notifications with fallback support for SMS and email services. The system is designed to handle banking events like transactions, security alerts, account updates, and system notifications.

## Features

### ✅ Multi-Channel Support
- **Email**: Multiple providers with fallback (SMTP, SendGrid, Mailgun, Resend, Amazon SES)
- **SMS**: Multiple providers with fallback (Twilio, Vonage, TextBelt, SMS.to, Africa's Talking, Termii)
- **Push Notifications**: Ready for implementation
- **In-App Notifications**: Stored in database for real-time display

### ✅ Event-Based Architecture
- Transaction events (completed, failed)
- Security events (login success/failure, suspicious activity)
- Account events (updates, verification)
- System events (maintenance, alerts)

### ✅ Free Tier Services Included
- **Email**: SendGrid (100/day), Mailgun (100/day), Resend (3000/month)
- **SMS**: TextBelt (1/day), SMS.to (free tier), Africa's Talking (free credits), Termii (free tier)

### ✅ Advanced Features
- User notification preferences
- Priority-based delivery
- Retry mechanism with exponential backoff
- Provider health monitoring
- Delivery logging and analytics
- Template system for customizable messages

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Banking App   │───▶│ Notification     │───▶│   Providers     │
│   Events        │    │ Service          │    │                 │
└─────────────────┘    └──────────────────┘    │ Email: SMTP,    │
                                               │ SendGrid, etc.  │
┌─────────────────┐    ┌──────────────────┐    │                 │
│   User          │───▶│ Preferences      │    │ SMS: Twilio,    │
│   Preferences   │    │ Management       │    │ Vonage, etc.    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Database Schema

### Tables Created
1. **notification_preferences** - User notification settings
2. **notification_events** - All notification events
3. **notification_logs** - Delivery attempts and status
4. **notifications** - In-app notifications
5. **provider_health** - Provider status monitoring
6. **notification_templates** - Customizable templates
7. **notification_queue** - Scheduled and retry notifications

## API Endpoints

### User Notification Management
- `GET /api/v1/notifications/preferences` - Get user preferences
- `PUT /api/v1/notifications/preferences` - Update preferences
- `GET /api/v1/notifications` - Get in-app notifications
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Testing & Monitoring
- `POST /api/v1/notifications/test` - Send test notification
- `GET /api/v1/notifications/logs` - Get delivery logs
- `GET /api/v1/notifications/providers/health` - Provider status

## Environment Variables

### Email Providers
```env
# SMTP (Basic email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SendGrid (100 emails/day free)
SENDGRID_API_KEY=your_sendgrid_api_key

# Mailgun (100 emails/day free)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Resend (3000 emails/month free)
RESEND_API_KEY=your_resend_api_key

# Amazon SES
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

### SMS Providers
```env
# Twilio (Paid service)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Vonage (Nexmo) (Free credits available)
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=your_vonage_from_number

# TextBelt (1 free SMS/day)
TEXTBELT_API_KEY=textbelt

# SMS.to (Free tier available)
SMSTO_API_KEY=your_smsto_api_key

# Africa's Talking (Free credits)
AFRICASTALKING_API_KEY=your_africastalking_api_key
AFRICASTALKING_USERNAME=your_africastalking_username
AFRICASTALKING_SENDER_ID=your_sender_id

# Termii (Nigerian SMS service with free tier)
TERMII_API_KEY=your_termii_api_key
TERMII_SENDER_ID=UBAS Financial Trust
```

## Usage Examples

### Emitting Events from Your Code

```typescript
import { notificationService } from '@/services/notificationService';

// Transaction completed
notificationService.emit('transaction:completed', {
  userId: 'user-123',
  type: 'transfer',
  amount: 50000,
  currency: 'NGN',
  reference: 'TXN123456',
  toAccountNumber: '1234567890'
});

// Security alert
notificationService.emit('security:login', {
  userId: 'user-123',
  success: false,
  device: 'Chrome on Windows',
  location: 'Lagos, Nigeria',
  failedAttempts: 3
});

// Account update
notificationService.emit('account:updated', {
  userId: 'user-123',
  description: 'Profile information updated'
});
```

### Custom Notifications

```typescript
// Send custom notification
await notificationService.sendNotification({
  id: uuidv4(),
  userId: 'user-123',
  type: 'marketing',
  priority: 'low',
  title: 'New Feature Available',
  message: 'Check out our new mobile app features!',
  channels: ['email', 'in_app'],
  data: { featureUrl: 'https://app.ubasfintrust.com/features' }
});
```

## Testing

Run the notification system test:

```bash
cd server
node test-notifications.js
```

This will test:
- ✅ Transaction completion notifications
- ✅ Security login notifications (success/failure)
- ✅ Custom notification events
- ✅ Multi-channel delivery
- ✅ User preference filtering

## Free Tier Service Limits

### Email Services
- **SendGrid**: 100 emails/day
- **Mailgun**: 100 emails/day (first 3 months)
- **Resend**: 3,000 emails/month, 100/day

### SMS Services
- **TextBelt**: 1 free SMS/day
- **SMS.to**: Free tier with limited credits
- **Africa's Talking**: Free credits for new accounts
- **Termii**: Free tier with limited SMS

## Provider Fallback Strategy

1. **Primary Provider**: First configured provider
2. **Health Check**: Verify provider availability
3. **Automatic Fallback**: Switch to next provider on failure
4. **Retry Logic**: Exponential backoff for critical notifications
5. **Load Balancing**: Distribute across healthy providers

## Monitoring & Analytics

- **Delivery Status**: Track sent/failed/retry status
- **Provider Performance**: Monitor success rates
- **User Engagement**: Track read rates for in-app notifications
- **Error Logging**: Detailed error tracking and debugging

## Security Features

- **Rate Limiting**: Prevent notification spam
- **Input Validation**: Sanitize all notification content
- **User Preferences**: Respect user opt-out choices
- **Audit Trail**: Complete delivery logging

## Next Steps

1. **Setup Environment Variables**: Configure your preferred providers
2. **Run Database Migration**: Create notification tables
3. **Test the System**: Use the test script to verify functionality
4. **Integrate Events**: Add notification events to your banking operations
5. **Customize Templates**: Create branded email/SMS templates
6. **Monitor Performance**: Set up alerts for provider failures

## Support

For issues or questions about the notification system:
1. Check the test script output for debugging
2. Review provider health status via API
3. Check notification logs for delivery issues
4. Verify environment variables are correctly set

The system is designed to be robust and handle failures gracefully, ensuring your users always receive important banking notifications through multiple channels.
