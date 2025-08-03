<template>
  <div class="notification-preferences">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-bell"></i>
          Notification Preferences
        </h3>
        <p class="card-subtitle">
          Choose how you want to receive notifications about your account activity
        </p>
      </div>

      <div class="card-body">
        <form @submit.prevent="savePreferences">
          <!-- Global Settings -->
          <div class="preference-section">
            <h4 class="section-title">General Settings</h4>
            <div class="preference-grid">
              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.email"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">Email Notifications</span>
                    <span class="preference-desc">Receive notifications via email</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.sms"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">SMS Notifications</span>
                    <span class="preference-desc">Receive notifications via SMS</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.push"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">Push Notifications</span>
                    <span class="preference-desc">Receive browser push notifications</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.inApp"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">In-App Notifications</span>
                    <span class="preference-desc">Show notifications in the app</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Transaction Notifications -->
          <div class="preference-section">
            <h4 class="section-title">
              <i class="fas fa-exchange-alt"></i>
              Transaction Notifications
            </h4>
            <div class="preference-grid">
              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.transactionEmail"
                    :disabled="!preferences.email"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">Email</span>
                    <span class="preference-desc">Transaction confirmations via email</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.transactionSms"
                    :disabled="!preferences.sms"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">SMS</span>
                    <span class="preference-desc">Transaction confirmations via SMS</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Security Notifications -->
          <div class="preference-section">
            <h4 class="section-title">
              <i class="fas fa-shield-alt"></i>
              Security Notifications
            </h4>
            <div class="preference-grid">
              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.securityEmail"
                    :disabled="!preferences.email"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">Email</span>
                    <span class="preference-desc">Security alerts via email</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.securitySms"
                    :disabled="!preferences.sms"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">SMS</span>
                    <span class="preference-desc">Security alerts via SMS</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Account Notifications -->
          <div class="preference-section">
            <h4 class="section-title">
              <i class="fas fa-user-cog"></i>
              Account Notifications
            </h4>
            <div class="preference-grid">
              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.accountEmail"
                    :disabled="!preferences.email"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">Email</span>
                    <span class="preference-desc">Account updates via email</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.accountSms"
                    :disabled="!preferences.sms"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">SMS</span>
                    <span class="preference-desc">Account updates via SMS</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Marketing Notifications -->
          <div class="preference-section">
            <h4 class="section-title">
              <i class="fas fa-bullhorn"></i>
              Marketing & Promotions
            </h4>
            <div class="preference-grid">
              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.marketingEmail"
                    :disabled="!preferences.email"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">Email</span>
                    <span class="preference-desc">Promotional offers via email</span>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input
                    type="checkbox"
                    v-model="preferences.marketingSms"
                    :disabled="!preferences.sms"
                    class="preference-checkbox"
                  />
                  <span class="checkmark"></span>
                  <div class="preference-info">
                    <span class="preference-name">SMS</span>
                    <span class="preference-desc">Promotional offers via SMS</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button
              type="button"
              @click="resetToDefaults"
              class="btn btn-secondary"
              :disabled="loading"
            >
              Reset to Defaults
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              <i class="fas fa-save" v-else></i>
              {{ loading ? 'Saving...' : 'Save Preferences' }}
            </button>
          </div>
        </form>

        <!-- Test Notification -->
        <div class="test-section">
          <h4 class="section-title">
            <i class="fas fa-vial"></i>
            Test Notifications
          </h4>
          <p class="test-description">
            Send a test notification to verify your settings are working correctly.
          </p>
          <button
            type="button"
            @click="sendTestNotification"
            class="btn btn-outline-primary"
            :disabled="testLoading"
          >
            <i class="fas fa-spinner fa-spin" v-if="testLoading"></i>
            <i class="fas fa-paper-plane" v-else></i>
            {{ testLoading ? 'Sending...' : 'Send Test Notification' }}
          </button>
        </div>

        <!-- Provider Status -->
        <div class="provider-status" v-if="providerStatus">
          <h4 class="section-title">
            <i class="fas fa-server"></i>
            Provider Status
          </h4>
          <div class="status-grid">
            <div class="status-item">
              <h5>Email Providers</h5>
              <div v-if="providerStatus.email.length === 0" class="no-providers">
                No email providers configured
              </div>
              <div v-else>
                <div 
                  v-for="provider in providerStatus.email" 
                  :key="provider.name"
                  class="provider-item"
                  :class="{ healthy: provider.healthy, unhealthy: !provider.healthy }"
                >
                  <i class="fas fa-circle"></i>
                  {{ provider.name }}
                </div>
              </div>
            </div>
            <div class="status-item">
              <h5>SMS Providers</h5>
              <div v-if="providerStatus.sms.length === 0" class="no-providers">
                No SMS providers configured
              </div>
              <div v-else>
                <div 
                  v-for="provider in providerStatus.sms" 
                  :key="provider.name"
                  class="provider-item"
                  :class="{ healthy: provider.healthy, unhealthy: !provider.healthy }"
                >
                  <i class="fas fa-circle"></i>
                  {{ provider.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'NotificationPreferences',
  setup() {
    const loading = ref(false)
    const testLoading = ref(false)
    const providerStatus = ref(null)
    
    const preferences = ref({
      email: true,
      sms: true,
      push: true,
      inApp: true,
      transactionEmail: true,
      transactionSms: true,
      securityEmail: true,
      securitySms: true,
      accountEmail: true,
      accountSms: false,
      systemEmail: false,
      systemSms: false,
      marketingEmail: false,
      marketingSms: false
    })

    const loadPreferences = async () => {
      try {
        // In a real app, this would fetch from the main API
        // For now, we'll use the stored preferences
        const stored = localStorage.getItem('notificationPreferences')
        if (stored) {
          Object.assign(preferences.value, JSON.parse(stored))
        }
      } catch (error) {
        console.error('Failed to load notification preferences:', error)
      }
    }

    const savePreferences = async () => {
      loading.value = true
      try {
        // In a real app, this would save to the main API
        localStorage.setItem('notificationPreferences', JSON.stringify(preferences.value))
        
        // Show success message
        alert('Notification preferences saved successfully!')
      } catch (error) {
        console.error('Failed to save preferences:', error)
        alert('Failed to save preferences')
      } finally {
        loading.value = false
      }
    }

    const resetToDefaults = () => {
      preferences.value = {
        email: true,
        sms: true,
        push: true,
        inApp: true,
        transactionEmail: true,
        transactionSms: true,
        securityEmail: true,
        securitySms: true,
        accountEmail: true,
        accountSms: false,
        systemEmail: false,
        systemSms: false,
        marketingEmail: false,
        marketingSms: false
      }
    }

    const sendTestNotification = async () => {
      testLoading.value = true
      try {
        await axios.post('http://localhost:3001/api/notifications/send', {
          userId: 'user-123',
          type: 'account',
          priority: 'medium',
          title: 'Test Notification',
          message: 'This is a test notification to verify your settings are working correctly.',
          channels: ['email', 'sms', 'in_app']
        })
        
        alert('Test notification sent successfully!')
      } catch (error) {
        console.error('Failed to send test notification:', error)
        alert('Failed to send test notification')
      } finally {
        testLoading.value = false
      }
    }

    const loadProviderStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/notifications/providers/status')
        providerStatus.value = response.data.data
      } catch (error) {
        console.error('Failed to load provider status:', error)
      }
    }

    onMounted(() => {
      loadPreferences()
      loadProviderStatus()
    })

    return {
      preferences,
      loading,
      testLoading,
      providerStatus,
      savePreferences,
      resetToDefaults,
      sendTestNotification
    }
  }
}
</script>

<style scoped>
.notification-preferences {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.card-body {
  padding: 24px;
}

.preference-section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.preference-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.preference-item:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.preference-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;
}

.preference-checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.preference-checkbox:checked + .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.preference-checkbox:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.preference-checkbox:disabled + .checkmark {
  opacity: 0.5;
  cursor: not-allowed;
}

.preference-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preference-name {
  font-weight: 500;
  color: #374151;
}

.preference-desc {
  font-size: 14px;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.test-section, .provider-status {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.test-description {
  color: #6b7280;
  margin-bottom: 16px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.status-item h5 {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #374151;
}

.provider-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.provider-item.healthy {
  background-color: #dcfce7;
  color: #166534;
}

.provider-item.unhealthy {
  background-color: #fef2f2;
  color: #dc2626;
}

.no-providers {
  color: #6b7280;
  font-style: italic;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-outline-primary {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-outline-primary:hover:not(:disabled) {
  background-color: #3b82f6;
  color: white;
}

@media (max-width: 768px) {
  .notification-preferences {
    padding: 16px;
  }
  
  .card-header {
    padding: 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .preference-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
