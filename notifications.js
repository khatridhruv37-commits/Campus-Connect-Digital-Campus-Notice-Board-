/* ==========================================
   CampusConnect - Notifications JavaScript
   ========================================== */

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.init();
    }

    init() {
        this.loadNotifications();
        this.initPushNotifications();
        this.initNotificationPanel();
        this.startPolling();
    }

    loadNotifications() {
        // Demo notifications
        this.notifications = [
            {
                id: 1,
                type: 'urgent',
                title: 'Exam Schedule Released',
                message: 'End Semester Exam schedule for December 2025 has been posted',
                time: new Date(Date.now() - 5 * 60 * 1000),
                read: false
            },
            {
                id: 2,
                type: 'success',
                title: 'Registration Confirmed',
                message: 'Your registration for TechnoHack 2025 is confirmed',
                time: new Date(Date.now() - 60 * 60 * 1000),
                read: false
            },
            {
                id: 3,
                type: 'info',
                title: 'New Placement Notice',
                message: 'Amazon is visiting campus on December 5th',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: true
            },
            {
                id: 4,
                type: 'warning',
                title: 'Fee Deadline Approaching',
                message: 'Last date for fee payment is November 30th',
                time: new Date(Date.now() - 5 * 60 * 60 * 1000),
                read: true
            },
            {
                id: 5,
                type: 'info',
                title: 'Assignment Reminder',
                message: 'DBMS Assignment 3 is due tomorrow',
                time: new Date(Date.now() - 24 * 60 * 60 * 1000),
                read: true
            }
        ];

        this.updateUnreadCount();
    }

    initPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            this.requestPermission();
        }
    }

    async requestPermission() {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted');
        }
    }

    showPushNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/badge.png',
                vibrate: [200, 100, 200],
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    initNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        const btn = document.querySelector('.notification-btn');
        const markReadBtn = document.querySelector('.mark-read');

        if (btn && panel) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.classList.toggle('open');
                this.renderNotifications();
            });

            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target) && !btn.contains(e.target)) {
                    panel.classList.remove('open');
                }
            });
        }

        if (markReadBtn) {
            markReadBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }
    }

    renderNotifications() {
        const container = document.querySelector('.panel-content');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.notifications.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
                <div class="notif-icon ${notif.type}">
                    <i class="fas fa-${this.getIcon(notif.type)}"></i>
                </div>
                <div class="notif-content">
                    <p><strong>${notif.title}</strong></p>
                    <p>${notif.message}</p>
                    <span class="notif-time">${this.formatTime(notif.time)}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
                item.classList.remove('unread');
            });
        });
    }

    getIcon(type) {
        const icons = {
            urgent: 'exclamation',
            success: 'check',
            warning: 'exclamation-triangle',
            info: 'info'
        };
        return icons[type] || 'bell';
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
        
        return date.toLocaleDateString();
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateUnreadCount();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateUnreadCount();
        this.renderNotifications();
        
        if (window.CampusConnect?.showToast) {
            window.CampusConnect.showToast('All notifications marked as read', 'success');
        }
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        
        const dot = document.querySelector('.notification-dot');
        const badge = document.querySelector('.notification-badge');
        
        if (dot) {
            dot.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
        
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }
    }

    addNotification(notification) {
        this.notifications.unshift({
            id: Date.now(),
            read: false,
            time: new Date(),
            ...notification
        });
        
        this.updateUnreadCount();
        
        // Show push notification for urgent
        if (notification.type === 'urgent') {
            this.showPushNotification(notification.title, {
                body: notification.message,
                tag: notification.id
            });
        }
        
        // Show toast
        if (window.CampusConnect?.showToast) {
            window.CampusConnect.showToast(notification.message, notification.type);
        }
    }

    startPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(() => {
            this.checkForNewNotifications();
        }, 30000);
    }

    async checkForNewNotifications() {
        // In production, this would make an API call
        // For demo, randomly add notifications
        if (Math.random() > 0.8) {
            const demoNotifications = [
                { type: 'info', title: 'New Notice Posted', message: 'Check the latest academic notice' },
                { type: 'success', title: 'Event Reminder', message: 'Workshop starts in 1 hour' },
                { type: 'warning', title: 'Deadline Alert', message: 'Assignment due in 2 days' }
            ];
            
            const randomNotif = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
            this.addNotification(randomNotif);
        }
    }

    clearAll() {
        this.notifications = [];
        this.updateUnreadCount();
        this.renderNotifications();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
});

// Export for external use
window.NotificationManager = NotificationManager;