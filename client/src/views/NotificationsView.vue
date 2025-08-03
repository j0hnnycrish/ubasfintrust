<template>
  <div class="notifications-view">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-bell"></i>
        Notifications
      </h1>
      <div class="header-actions">
        <button @click="markAllAsRead" class="btn btn-secondary" :disabled="unreadCount === 0">
          <i class="fas fa-check-double"></i>
          Mark All Read
        </button>
        <router-link to="/settings/notifications" class="btn btn-primary">
          <i class="fas fa-cog"></i>
          Settings
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="filter-tab"
          :class="{ active: activeFilter === filter.value }"
        >
          <i :class="filter.icon"></i>
          {{ filter.label }}
          <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="notifications-container">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        Loading notifications...
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <h3>No notifications</h3>
        <p v-if="activeFilter === 'all'">You don't have any notifications yet.</p>
        <p v-else>No {{ activeFilter }} notifications found.</p>
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="notification-card"
          :class="{
            unread: !notification.read,
            [`priority-${notification.priority}`]: true,
            [`type-${notification.type}`]: true
          }"
        >
          <div class="notification-header">
            <div class="notification-meta">
              <div class="notification-icon">
                <i :class="getNotificationIcon(notification.type)"></i>
              </div>
              <div class="notification-info">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <div class="notification-details">
                  <span class="notification-type">{{ formatType(notification.type) }}</span>
                  <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                  <span v-if="notification.priority !== 'low'" class="notification-priority">
                    {{ notification.priority }}
                  </span>
                </div>
              </div>
            </div>
            <div class="notification-actions">
              <button
                v-if="!notification.read"
                @click="markAsRead(notification.id)"
                class="btn-action"
                title="Mark as read"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                @click="deleteNotification(notification.id)"
                class="btn-action btn-danger"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="notification-body">
            <p class="notification-message">{{ notification.message }}</p>
            
            <div v-if="notification.data" class="notification-data">
              <details>
                <summary>View Details</summary>
                <pre>{{ JSON.stringify(notification.data, null, 2) }}</pre>
              </details>
            </div>
          </div>

          <div v-if="!notification.read" class="unread-indicator"></div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && !loading" class="load-more-section">
        <button @click="loadMore" class="btn btn-outline-primary">
          Load More Notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'NotificationsView',
  setup() {
    const loading = ref(false)
    const notifications = ref([])
    const activeFilter = ref('all')
    const hasMore = ref(false)
    const page = ref(1)

    const filters = computed(() => [
      {
        value: 'all',
        label: 'All',
        icon: 'fas fa-bell',
        count: notifications.value.length
      },
      {
        value: 'unread',
        label: 'Unread',
        icon: 'fas fa-circle',
        count: notifications.value.filter(n => !n.read).length
      },
      {
        value: 'transaction',
        label: 'Transactions',
        icon: 'fas fa-exchange-alt',
        count: notifications.value.filter(n => n.type === 'transaction').length
      },
      {
        value: 'security',
        label: 'Security',
        icon: 'fas fa-shield-alt',
        count: notifications.value.filter(n => n.type === 'security').length
      },
      {
        value: 'account',
        label: 'Account',
        icon: 'fas fa-user-cog',
        count: notifications.value.filter(n => n.type === 'account').length
      }
    ])

    const unreadCount = computed(() => 
      notifications.value.filter(n => !n.read).length
    )

    const filteredNotifications = computed(() => {
      let filtered = notifications.value

      if (activeFilter.value === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else if (activeFilter.value !== 'all') {
        filtered = filtered.filter(n => n.type === activeFilter.value)
      }

      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const loadNotifications = async (reset = false) => {
      loading.value = true
      try {
        const response = await axios.get('http://localhost:3001/api/notifications/user-123')
        
        if (reset) {
          notifications.value = response.data.data || []
        } else {
          notifications.value = [...notifications.value, ...(response.data.data || [])]
        }
        
        hasMore.value = false // For demo, assume no pagination
      } catch (error) {
        console.error('Failed to load notifications:', error)
      } finally {
        loading.value = false
      }
    }

    const markAsRead = async (notificationId) => {
      try {
        await axios.patch(`http://localhost:3001/api/notifications/${notificationId}/read`)
        
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification) {
          notification.read = true
          notification.readAt = new Date()
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    const markAllAsRead = async () => {
      try {
        const unreadNotifications = notifications.value.filter(n => !n.read)
        
        for (const notification of unreadNotifications) {
          await markAsRead(notification.id)
        }
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
      }
    }

    const deleteNotification = async (notificationId) => {
      if (!confirm('Are you sure you want to delete this notification?')) {
        return
      }

      try {
        // In a real app, this would call the delete API
        notifications.value = notifications.value.filter(n => n.id !== notificationId)
      } catch (error) {
        console.error('Failed to delete notification:', error)
      }
    }

    const loadMore = () => {
      page.value++
      loadNotifications(false)
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

    const formatType = (type) => {
      const types = {
        transaction: 'Transaction',
        security: 'Security',
        account: 'Account',
        system: 'System',
        marketing: 'Marketing'
      }
      return types[type] || type
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))

      if (diffInMinutes < 1) {
        return 'Just now'
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60)
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
      } else if (diffInMinutes < 10080) {
        const days = Math.floor(diffInMinutes / 1440)
        return `${days} day${days === 1 ? '' : 's'} ago`
      } else {
        return date.toLocaleDateString()
      }
    }

    onMounted(() => {
      loadNotifications(true)
    })

    return {
      loading,
      notifications,
      activeFilter,
      filters,
      unreadCount,
      filteredNotifications,
      hasMore,
      loadNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      loadMore,
      getNotificationIcon,
      formatType,
      formatTime
    }
  }
}
</script>

<style scoped>
.notifications-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filters-section {
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 14px;
}

.filter-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

.notifications-container {
  min-height: 400px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #374151;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.notification-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}

.notification-card.unread {
  background: #eff6ff;
  border-color: #3b82f6;
}

.notification-card.priority-high {
  border-left: 4px solid #f59e0b;
}

.notification-card.priority-critical {
  border-left: 4px solid #ef4444;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.notification-meta {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  flex-shrink: 0;
}

.notification-card.type-transaction .notification-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.notification-card.type-security .notification-icon {
  background: #fef2f2;
  color: #ef4444;
}

.notification-card.type-account .notification-icon {
  background: #f0fdf4;
  color: #22c55e;
}

.notification-info {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.notification-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.notification-type {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.notification-priority {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.notification-card.priority-critical .notification-priority {
  background: #fef2f2;
  color: #dc2626;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action:hover {
  background: #e5e7eb;
  color: #374151;
}

.btn-action.btn-danger:hover {
  background: #fef2f2;
  color: #dc2626;
}

.notification-body {
  margin-top: 12px;
}

.notification-message {
  margin: 0 0 12px 0;
  color: #374151;
  line-height: 1.5;
}

.notification-data details {
  margin-top: 12px;
}

.notification-data summary {
  cursor: pointer;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
}

.notification-data pre {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  margin-top: 8px;
}

.unread-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
}

.load-more-section {
  text-align: center;
  margin-top: 32px;
}

.btn {
  padding: 10px 20px;
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
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-outline-primary {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-outline-primary:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

@media (max-width: 768px) {
  .notifications-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }

  .notification-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .notification-actions {
    align-self: flex-end;
  }
}
</style>
