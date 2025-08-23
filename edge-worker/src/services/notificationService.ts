// Define Env type for Cloudflare Worker bindings
type Env = {
  DB: any;
  APP_KV?: any;
  JWT_SECRET: string;
  JWT_AUD?: string;
  [key: string]: any;
};
// import type { Env } from '../worker' // Remove or fix if not needed

interface NotificationPayload {
  userId: string
  type: 'transaction' | 'security' | 'account' | 'kyc' | 'system' | 'marketing'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  channels: ('email' | 'sms' | 'push' | 'in_app')[]
  data?: any
}

interface EmailProvider {
  name: string
  send: (to: string, subject: string, content: string, data?: any) => Promise<boolean>
}

interface SMSProvider {
  name: string
  send: (to: string, message: string, data?: any) => Promise<boolean>
}

export class NotificationService {
  private env: Env
  private emailProviders: EmailProvider[] = []
  private smsProviders: SMSProvider[] = []

  constructor(env: Env) {
    this.env = env
    this.initializeProviders()
  }

  private initializeProviders() {
    // SendGrid Email Provider
    if ((this.env as any).SENDGRID_API_KEY) {
      this.emailProviders.push({
        name: 'sendgrid',
        send: async (to: string, subject: string, content: string) => {
          try {
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${(this.env as any).SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: 'noreply@ubasfintrust.com', name: 'UBAS Financial Trust' },
                subject,
                content: [{ type: 'text/html', value: content }]
              })
            })
            return response.ok
          } catch (error) {
            console.error('SendGrid error:', error)
            return false
          }
        }
      })
    }

    // Mailgun Email Provider
    if ((this.env as any).MAILGUN_API_KEY && (this.env as any).MAILGUN_DOMAIN) {
      this.emailProviders.push({
        name: 'mailgun',
        send: async (to: string, subject: string, content: string) => {
          try {
            const formData = new FormData()
            formData.append('from', 'UBAS Financial Trust <noreply@ubasfintrust.com>')
            formData.append('to', to)
            formData.append('subject', subject)
            formData.append('html', content)

            const response = await fetch(`https://api.mailgun.net/v3/${(this.env as any).MAILGUN_DOMAIN}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${btoa(`api:${(this.env as any).MAILGUN_API_KEY}`)}`
              },
              body: formData
            })
            return response.ok
          } catch (error) {
            console.error('Mailgun error:', error)
            return false
          }
        }
      })
    }

    // Resend Email Provider
    if ((this.env as any).RESEND_API_KEY) {
      this.emailProviders.push({
        name: 'resend',
        send: async (to: string, subject: string, content: string) => {
          try {
            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${(this.env as any).RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'UBAS Financial Trust <noreply@ubasfintrust.com>',
                to: [to],
                subject,
                html: content
              })
            })
            return response.ok
          } catch (error) {
            console.error('Resend error:', error)
            return false
          }
        }
      })
    }

    // Vonage SMS Provider
    if ((this.env as any).VONAGE_API_KEY && (this.env as any).VONAGE_API_SECRET) {
      this.smsProviders.push({
        name: 'vonage',
        send: async (to: string, message: string) => {
          try {
            const response = await fetch('https://rest.nexmo.com/sms/json', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                api_key: (this.env as any).VONAGE_API_KEY,
                api_secret: (this.env as any).VONAGE_API_SECRET,
                from: 'UBAS Trust',
                to: to.replace(/^\+/, ''),
                text: message
              })
            })
            const result = await response.json() as any
            return result.messages?.[0]?.status === '0'
          } catch (error) {
            console.error('Vonage error:', error)
            return false
          }
        }
      })
    }

    // Textbelt SMS Provider
    if ((this.env as any).TEXTBELT_API_KEY) {
      this.smsProviders.push({
        name: 'textbelt',
        send: async (to: string, message: string) => {
          try {
            const response = await fetch('https://textbelt.com/text', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                phone: to,
                message,
                key: (this.env as any).TEXTBELT_API_KEY
              })
            })
            const result = await response.json() as any
            return result.success === true
          } catch (error) {
            console.error('Textbelt error:', error)
            return false
          }
        }
      })
    }
  }

  async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    for (const provider of this.emailProviders) {
      try {
        const success = await provider.send(to, subject, content)
        if (success) {
          console.log(`Email sent successfully via ${provider.name}`)
          return true
        }
      } catch (error) {
        console.error(`Email provider ${provider.name} failed:`, error)
      }
    }
    console.error('All email providers failed')
    return false
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    for (const provider of this.smsProviders) {
      try {
        const success = await provider.send(to, message)
        if (success) {
          console.log(`SMS sent successfully via ${provider.name}`)
          return true
        }
      } catch (error) {
        console.error(`SMS provider ${provider.name} failed:`, error)
      }
    }
    console.error('All SMS providers failed')
    return false
  }

  async createInAppNotification(userId: string, type: string, title: string, message: string, data?: any): Promise<boolean> {
    try {
      const notificationId = crypto.randomUUID()
      const now = new Date().toISOString()
      
  await this.env.DB.prepare(`
        INSERT INTO notifications (id, user_id, type, title, message, data, read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, false, ?)
      `).bind(notificationId, userId, type, title, message, JSON.stringify(data || {}), now).run()
      
      return true
    } catch (error) {
      console.error('Failed to create in-app notification:', error)
      return false
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    const { userId, type, priority, title, message, channels, data } = payload

    // Get user details for email/SMS
    let userEmail = ''
    let userPhone = ''
    
    try {
      const databaseUrl = (this.env as any).DATABASE_URL as string | undefined
      const sql = getNeonClient(databaseUrl)
      
      if (sql) {
        const userResult = await (sql as any)`SELECT email, phone FROM users WHERE id = ${userId} LIMIT 1`
        const user = (userResult as any[])[0]
        userEmail = user?.email || ''
        userPhone = user?.phone || ''
      } else {
  const user = await this.env.DB.prepare('SELECT email, phone FROM users WHERE id = ? LIMIT 1').bind(userId).first()
        userEmail = (user as any)?.email || ''
        userPhone = (user as any)?.phone || ''
      }
    } catch (error) {
      console.error('Failed to get user details:', error)
    }

    // Send notifications via requested channels
    const promises: Promise<any>[] = []

    if (channels.includes('email') && userEmail) {
      promises.push(this.sendEmail(userEmail, title, message))
    }

    if (channels.includes('sms') && userPhone) {
      promises.push(this.sendSMS(userPhone, `${title}: ${message}`))
    }

    if (channels.includes('in_app')) {
      promises.push(this.createInAppNotification(userId, type, title, message, data))
    }

    // Execute all notifications in parallel
    await Promise.allSettled(promises)
  }

  // Utility methods for common notifications
  async sendTransactionNotification(userId: string, type: 'deposit' | 'withdrawal' | 'transfer', amount: number, currency = 'USD') {
    const title = `Transaction ${type.charAt(0).toUpperCase() + type.slice(1)}`
    const message = `Your ${type} of ${currency} ${amount.toLocaleString()} has been processed successfully.`
    
    await this.sendNotification({
      userId,
      type: 'transaction',
      priority: 'medium',
      title,
      message,
      channels: ['email', 'sms', 'in_app'],
      data: { type, amount, currency }
    })
  }

  async sendSecurityNotification(userId: string, event: string, details?: string) {
    const title = 'Security Alert'
    const message = `Security event detected: ${event}${details ? `. ${details}` : ''}`
    
    await this.sendNotification({
      userId,
      type: 'security',
      priority: 'high',
      title,
      message,
      channels: ['email', 'sms', 'in_app'],
      data: { event, details }
    })
  }

  async sendKYCNotification(userId: string, status: 'submitted' | 'approved' | 'rejected', reason?: string) {
    const titles = {
      submitted: 'KYC Application Submitted',
      approved: 'KYC Application Approved',
      rejected: 'KYC Application Rejected'
    }
    
    const messages = {
      submitted: 'Your KYC application has been submitted and is under review.',
      approved: 'Your KYC application has been approved. You now have full access to all banking services.',
      rejected: `Your KYC application has been rejected.${reason ? ` Reason: ${reason}` : ''}`
    }
    
    await this.sendNotification({
      userId,
      type: 'kyc',
      priority: status === 'rejected' ? 'high' : 'medium',
      title: titles[status],
      message: messages[status],
      channels: ['email', 'sms', 'in_app'],
      data: { status, reason }
    })
  }

  getProviderStatus() {
    return {
      email: this.emailProviders.map(p => ({
        name: p.name,
        available: true,
        lastCheck: new Date().toISOString()
      })),
      sms: this.smsProviders.map(p => ({
        name: p.name,
        available: true,
        lastCheck: new Date().toISOString()
      }))
    }
  }
}

// Function to get neon client (imported from other file)
function getNeonClient(databaseUrl?: string): any {
  if (!databaseUrl) return null
  try {
    // This would be imported from the neon file
    return null // Placeholder - will be replaced with actual implementation
  } catch {
    return null
  }
}

export function initializeNotificationServices(env: Env): NotificationService {
  return new NotificationService(env)
}
