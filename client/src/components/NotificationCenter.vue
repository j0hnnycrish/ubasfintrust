<template>
  <div class="notification-center">
    <!-- Notification Bell Icon -->
    <div class="notification-bell" @click="toggleDropdown">
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </div>

    <!-- Notification Dropdown -->
    <div v-if="showDropdown" class="notification-dropdown" @click.stop>
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <div class="header-actions">
          <button @click="markAllAsRead" class="btn-link" :disabled="unreadCount === 0">
            Mark all as read
          </button>
          <button @click="showDropdown = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="dropdown-body">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Loading notifications...
        </div>

        <div v-else-if="notifications.length === 0" class="empty-state">
          <i class="fas fa-bell-slash"></i>
          <p>No notifications yet</p>
        </div>

        <div v-else class="notification-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{
              unread: !notification.read,
              [`priority-${notification.priority}`]: true
            }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon">
              <i :class="getNotificationIcon(notification.type)"></i>
            </div>
            <div class="notification-content">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
            </div>
            <div v-if="!notification.read" class="unread-indicator"></div>
          </div>
        </div>
      </div>

      <div class="dropdown-footer">
        <router-link to="/notifications" class="view-all-link" @click="showDropdown = false">
          View all notifications
        </router-link>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="showDropdown" class="notification-overlay" @click="showDropdown = false"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export default {
  name: 'NotificationCenter',
  setup() {
    const showDropdown = ref(false)
    const loading = ref(false)
    const notifications = ref([])
    const unreadCount = ref(0)
    let pollInterval = null

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
      if (showDropdown.value) {
        loadNotifications()
      }
    }

    const loadNotifications = async () => {
      loading.value = true
      try {
        const response = await axios.get('http://localhost:3001/api/notifications/user-123')
        notifications.value = response.data.data || []
        unreadCount.value = notifications.value.filter(n => !n.read).length
      } catch (error) {
        console.error('Failed to load notifications:', error)
      } finally {
        loading.value = false
      }
    }

    const markAsRead = async (notificationId) => {
      try {
        await axios.patch(`http://localhost:3001/api/notifications/${notificationId}/read`)
        
        // Update local state
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification && !notification.read) {
          notification.read = true
          notification.readAt = new Date()
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    const markAllAsRead = async () => {
      try {
        // Mark all unread notifications as read
        const unreadNotifications = notifications.value.filter(n => !n.read)
        
        for (const notification of unreadNotifications) {
          await markAsRead(notification.id)
        }
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
      }
    }

    const getNotificationIcon = (type) => {
      const icons = {
        transaction: 'fas fa-exchange-alt',
        security: 'fas fa-shield-alt',
        account: 'fas fa-user-cog',
        system: 'fas fa-cog',
        marketing: 'fas fa-bullhorn'
      }
      return icons[type] || 'fas fa-bell'
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))

      if (diffInMinutes < 1) {
        return 'Just now'
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60)
        return `${hours}h ago`
      } else {
        const days = Math.floor(diffInMinutes / 1440)
        return `${days}d ago`
      }
    }

    const startPolling = () => {
      // Poll for new notifications every 30 seconds
      pollInterval = setInterval(() => {
        if (!showDropdown.value) {
          loadNotifications()
        }
      }, 30000)
    }

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval)
        pollInterval = null
      }
    }

    onMounted(() => {
      loadNotifications()
      startPolling()
    })

    onUnmounted(() => {
      stopPolling()
    })

    return {
      showDropdown,
      loading,
      notifications,
      unreadCount,
      toggleDropdown,
      markAsRead,
      markAllAsRead,
      getNotificationIcon,
      formatTime
    }
  }
}
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  color: #6b7280;
}

.notification-bell:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
}

.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 999;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-link {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.btn-link:hover:not(:disabled) {
  background-color: #eff6ff;
}

.btn-link:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.dropdown-body {
  max-height: 350px;
  overflow-y: auto;
}

.loading-state, .empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
}

.empty-state i {
  font-size: 32px;
  margin-bottom: 12px;
  color: #d1d5db;
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  border-left: 3px solid transparent;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-item.priority-high {
  border-left-color: #f59e0b;
}

.notification-item.priority-critical {
  border-left-color: #ef4444;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: #e5e7eb;
  color: #6b7280;
}

.notification-item.unread .notification-icon {
  background-color: #3b82f6;
  color: white;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.3;
}

.notification-message {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 11px;
  color: #9ca3af;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444; /* red */
  margin-left: 8px;
  flex-shrink: 0;
  margin-top: 4px;
}

.dropdown-footer {
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  text-align: center;
}

.view-all-link {
  color: #ef4444; /* red */
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  display: inline-block;
}

.view-all-link:hover {
  background-color: #fee2e2; /* red-100 */
}

/* Responsive */
@media (max-width: 480px) {
  .notification-dropdown {
    width: 320px;
    right: -20px;
  }
}

/* Scrollbar styling */
.dropdown-body::-webkit-scrollbar {
  width: 4px;
}

.dropdown-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.dropdown-body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
