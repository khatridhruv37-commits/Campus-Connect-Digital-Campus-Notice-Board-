/* ==========================================
   CampusConnect - Main JavaScript
   Digital Notice Board & Event Management
   ========================================== */

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initNavbar();
    initTheme();
    initSidebar();
    initDropdowns();
    initAnimations();
    initCounters();
    initCalendarWidget();
    initNotifications();
    initSearch();
    initFilters();
    initForms();
    initModals();
    initTooltips();
    initDateTime();
    initEventCountdown();
    initTabs();
    initFileUpload();
});

// ===== Preloader =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 1000);
        });
    }
}

// ===== Navbar =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu on link click
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Theme Toggle =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    } else if (systemDark) {
        html.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme === 'dark');
            
            // Add animation
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }

    function updateThemeIcon(isDark) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ===== Sidebar =====
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            document.body.classList.toggle('sidebar-open');
        });
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        });
    }

    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            }
        }
    });
}

// ===== Dropdowns =====
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.header-dropdown, .user-dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.querySelector('.dropdown-menu')?.classList.remove('show');
                }
            });
            
            menu?.classList.toggle('show');
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

// ===== Scroll Animations =====
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // For stagger animation
                const staggerChildren = entry.target.querySelectorAll('.stagger-item');
                staggerChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('revealed');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
        observer.observe(el);
    });

    // Feature cards animation
    document.querySelectorAll('.feature-card, .testimonial-card, .category-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===== Counter Animation =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                el.textContent = formatNumber(Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = formatNumber(target);
            }
        };

        updateCounter();
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                countUp(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== Calendar Widget =====
function initCalendarWidget() {
    const calendarDates = document.getElementById('calendarDates');
    if (!calendarDates) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    generateCalendar(currentMonth, currentYear);

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = today.getDate();

        let html = '';

        // Empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="date other-month"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === todayDate && month === today.getMonth() && year === today.getFullYear();
            const hasEvent = [5, 12, 15, 20, 25, 28].includes(day); // Demo events
            
            html += `<div class="date ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">${day}</div>`;
        }

        calendarDates.innerHTML = html;

        // Add click handlers
        calendarDates.querySelectorAll('.date:not(.other-month)').forEach(date => {
            date.addEventListener('click', () => {
                calendarDates.querySelectorAll('.date').forEach(d => d.classList.remove('selected'));
                date.classList.add('selected');
            });
        });
    }
}

// ===== Notifications =====
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPanel = document.getElementById('notificationPanel');

    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationPanel.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!notificationPanel.contains(e.target)) {
                notificationPanel.classList.remove('open');
            }
        });
    }

    // Mark notifications as read
    const markReadBtn = document.querySelector('.mark-read');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            const dot = document.querySelector('.notification-dot');
            if (dot) dot.style.display = 'none';
        });
    }
}

// ===== Search Functionality =====
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        // Keyboard shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape') {
                searchInput.blur();
            }
        });

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                performSearch(query);
            }, 300);
        });
    }

    function performSearch(query) {
        if (query.length < 2) return;
        
        // This would typically make an API call
        console.log('Searching for:', query);
        
        // Demo: Filter visible cards
        const cards = document.querySelectorAll('.notice-card, .event-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
    }
}

// ===== Filters =====
function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const deptFilter = document.getElementById('deptFilter');
    const clearFilters = document.getElementById('clearFilters');
    const sortBy = document.getElementById('sortBy');

    const filters = [categoryFilter, priorityFilter, deptFilter, sortBy];

    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            filters.forEach(filter => {
                if (filter) filter.value = '';
            });
            applyFilters();
        });
    }

    function applyFilters() {
        const category = categoryFilter?.value || '';
        const priority = priorityFilter?.value || '';
        const dept = deptFilter?.value || '';
        const sort = sortBy?.value || 'newest';

        const notices = document.querySelectorAll('.notice-card');
        
        notices.forEach(notice => {
            const noticeCategory = notice.dataset.category || '';
            const noticePriority = notice.dataset.priority || '';
            
            let show = true;
            
            if (category && noticeCategory !== category) show = false;
            if (priority && noticePriority !== priority) show = false;
            
            notice.style.display = show ? '' : 'none';
        });

        // Update results count
        const visibleNotices = document.querySelectorAll('.notice-card:not([style*="display: none"])');
        const resultsCount = document.querySelector('.results-count strong');
        if (resultsCount) {
            resultsCount.textContent = visibleNotices.length;
        }
    }

    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    const noticesContainer = document.getElementById('noticesContainer');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (noticesContainer) {
                noticesContainer.classList.toggle('grid-view', view === 'grid');
            }
        });
    });
}

// ===== Forms =====
function initForms() {
    // Password toggle
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Password strength
    const passwordInput = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthFill) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);
            
            strengthFill.className = 'strength-fill ' + strength.class;
            if (strengthText) strengthText.textContent = strength.text;
        });
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 2) return { class: 'weak', text: 'Weak password' };
        if (score < 4) return { class: 'medium', text: 'Medium password' };
        return { class: 'strong', text: 'Strong password' };
    }

    // Multi-step form
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNum = parseInt(currentStep.dataset.step);
            const nextStepNum = currentStepNum + 1;

            // Validate current step
            const inputs = currentStep.querySelectorAll('input[required], select[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value) {
                    valid = false;
                    input.parentElement.classList.add('error');
                } else {
                    input.parentElement.classList.remove('error');
                }
            });

            if (!valid) {
                showToast('Please fill all required fields', 'error');
                return;
            }

            // Move to next step
            currentStep.classList.remove('active');
            document.querySelector(`.form-step[data-step="${nextStepNum}"]`)?.classList.add('active');
            
            progressSteps.forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                if (stepNum < nextStepNum) step.classList.add('completed');
                if (stepNum === nextStepNum) step.classList.add('active');
                if (stepNum > nextStepNum) {
                    step.classList.remove('completed', 'active');
                }
            });
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNum = parseInt(currentStep.dataset.step);
            const prevStepNum = currentStepNum - 1;

            currentStep.classList.remove('active');
            document.querySelector(`.form-step[data-step="${prevStepNum}"]`)?.classList.add('active');
            
            progressSteps.forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                step.classList.remove('active');
                if (stepNum === prevStepNum) step.classList.add('active');
                if (stepNum >= currentStepNum) step.classList.remove('completed');
            });
        });
    });

    // Character count
    const titleInput = document.getElementById('noticeTitle');
    const charCount = document.querySelector('.char-count');
    
    if (titleInput && charCount) {
        titleInput.addEventListener('input', () => {
            const count = titleInput.value.length;
            charCount.textContent = `${count}/100`;
            charCount.style.color = count > 90 ? 'var(--error)' : '';
        });
    }

    // Form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner small"></span> Processing...';
            }

            // Simulate API call
            setTimeout(() => {
                showToast('Form submitted successfully!', 'success');
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                }

                // Redirect based on form
                if (form.id === 'loginForm') {
                    window.location.href = 'dashboard.html';
                } else if (form.id === 'registerForm') {
                    window.location.href = 'login.html';
                }
            }, 2000);
        });
    });
}

// ===== Modals =====
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const modal = close.closest('.modal');
            if (modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.open').forEach(modal => {
                modal.classList.remove('open');
            });
            document.body.style.overflow = '';
        }
    });
}

// ===== Tooltips =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = el.dataset.tooltip;
            
            document.body.appendChild(tooltip);
            
            const rect = el.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        });

        el.addEventListener('mouseleave', () => {
            document.querySelectorAll('.tooltip').forEach(t => t.remove());
        });
    });
}

// ===== Date & Time =====
function initDateTime() {
    const currentDate = document.getElementById('currentDate');
    
    if (currentDate) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Update time every minute
    const updateTime = () => {
        const timeElements = document.querySelectorAll('.current-time');
        timeElements.forEach(el => {
            el.textContent = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        });
    };
    updateTime();
    setInterval(updateTime, 60000);
}

// ===== Event Countdown =====
function initEventCountdown() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if (!days || !hours || !minutes || !seconds) return;

    // Set target date (5 days from now for demo)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    targetDate.setHours(9, 0, 0, 0);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            days.textContent = '00';
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        days.textContent = String(d).padStart(2, '0');
        hours.textContent = String(h).padStart(2, '0');
        minutes.textContent = String(m).padStart(2, '0');
        seconds.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Tabs =====
function initTabs() {
    const tabContainers = document.querySelectorAll('.event-tabs, .profile-tabs');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update content
                const parent = container.closest('.profile-content') || container.closest('.page-content');
                if (parent) {
                    parent.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    const targetContent = parent.querySelector(`#${tabId}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                }
            });
        });
    });
}

// ===== File Upload =====
function initFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadedFiles = document.getElementById('uploadedFiles');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            // Validate file
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (file.size > maxSize) {
                showToast(`${file.name} is too large (max 10MB)`, 'error');
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                showToast(`${file.name} is not a supported file type`, 'error');
                return;
            }

            // Add to list
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file';
            fileItem.innerHTML = `
                <i class="fas ${getFileIcon(file.type)}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <button type="button" class="remove-file"><i class="fas fa-times"></i></button>
            `;

            fileItem.querySelector('.remove-file').addEventListener('click', () => {
                fileItem.remove();
            });

            uploadedFiles?.appendChild(fileItem);
        });
    }

    function getFileIcon(type) {
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('image')) return 'fa-file-image';
        if (type.includes('word')) return 'fa-file-word';
        return 'fa-file';
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

// ===== Toast Notifications =====
function showToast(message, type = 'info', title = '') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check',
        error: 'fa-times',
        warning: 'fa-exclamation',
        info: 'fa-info'
    };

    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title || titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 5000);

    return toast;
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function removeToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// ===== Bookmark Functionality =====
document.addEventListener('click', (e) => {
    if (e.target.closest('.bookmark-btn')) {
        const btn = e.target.closest('.bookmark-btn');
        const icon = btn.querySelector('i');
        
        btn.classList.toggle('bookmarked');
        
        if (btn.classList.contains('bookmarked')) {
            icon.classList.replace('far', 'fas');
            showToast('Notice bookmarked!', 'success');
        } else {
            icon.classList.replace('fas', 'far');
            showToast('Bookmark removed', 'info');
        }
    }
});

// ===== Event Registration =====
document.addEventListener('click', (e) => {
    if (e.target.closest('.event-card .btn-primary')) {
        const btn = e.target.closest('.btn-primary');
        
        if (btn.textContent.includes('Register') || btn.textContent.includes('Apply') || btn.textContent.includes('Join')) {
            btn.disabled = true;
            btn.innerHTML = '<span class="loading-spinner small"></span>';
            
            setTimeout(() => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-success');
                btn.disabled = false;
                btn.textContent = 'Registered';
                showToast('Successfully registered for the event!', 'success');
            }, 1500);
        }
    }
});

// ===== Favorite Events =====
document.addEventListener('click', (e) => {
    if (e.target.closest('.event-favorite')) {
        const btn = e.target.closest('.event-favorite');
        const icon = btn.querySelector('i');
        
        btn.classList.toggle('favorited');
        
        if (btn.classList.contains('favorited')) {
            icon.classList.replace('far', 'fas');
        } else {
            icon.classList.replace('fas', 'far');
        }
    }
});

// ===== Role Selector =====
const roleBtns = document.querySelectorAll('.role-btn');
roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== Ripple Effect =====
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    
    btn.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Service Worker Registration (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ===== Export functions for use in other modules =====
window.CampusConnect = {
    showToast,
    initAnimations,
    initCounters
};