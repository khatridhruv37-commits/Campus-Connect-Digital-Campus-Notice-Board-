/* ==========================================
   CampusConnect - Calendar JavaScript
   ========================================== */

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = this.generateDemoEvents();
        
        this.init();
    }

    init() {
        this.monthYearEl = document.getElementById('monthYear');
        this.calendarBody = document.getElementById('calendarBody');
        this.prevBtn = document.getElementById('prevMonth');
        this.nextBtn = document.getElementById('nextMonth');
        this.todayBtn = document.getElementById('todayBtn');
        this.viewBtns = document.querySelectorAll('.calendar-views .view-btn');

        if (!this.calendarBody) return;

        this.render();
        this.attachEventListeners();
    }

    generateDemoEvents() {
        const events = [];
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // Academic events
        events.push(
            { date: new Date(year, month, 5), title: 'Assignment Deadline', type: 'academic', time: '11:59 PM' },
            { date: new Date(year, month, 12), title: 'Mid-Semester Exam', type: 'academic', time: '9:00 AM' },
            { date: new Date(year, month, 20), title: 'Lab Practical', type: 'academic', time: '2:00 PM' },
            { date: new Date(year, month, 25), title: 'Project Submission', type: 'deadline', time: '11:59 PM' }
        );

        // Events
        events.push(
            { date: new Date(year, month, 8), title: 'TechnoHack 2025', type: 'events', time: '9:00 AM' },
            { date: new Date(year, month, 15), title: 'Workshop: AI/ML', type: 'events', time: '10:00 AM' },
            { date: new Date(year, month, 22), title: 'Cultural Fest', type: 'events', time: 'All Day' }
        );

        // Placements
        events.push(
            { date: new Date(year, month, 10), title: 'Google Drive', type: 'placements', time: '10:00 AM' },
            { date: new Date(year, month, 18), title: 'Microsoft Interview', type: 'placements', time: '9:00 AM' },
            { date: new Date(year, month, 28), title: 'Amazon PPT', type: 'placements', time: '11:00 AM' }
        );

        // Club activities
        events.push(
            { date: new Date(year, month, 7), title: 'Coding Club Meet', type: 'clubs', time: '5:00 PM' },
            { date: new Date(year, month, 14), title: 'Photo Walk', type: 'clubs', time: '6:00 AM' },
            { date: new Date(year, month, 21), title: 'Robotics Workshop', type: 'clubs', time: '3:00 PM' }
        );

        // Deadlines
        events.push(
            { date: new Date(year, month, 30), title: 'Fee Payment', type: 'deadline', time: '11:59 PM' }
        );

        return events;
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        this.monthYearEl.textContent = `${monthNames[month]} ${year}`;

        // Calculate calendar grid
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        let html = '';

        // Previous month days
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            html += `<div class="calendar-day other-month">
                <div class="day-number">${day}</div>
            </div>`;
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isSameDay(date, today);
            const isSelected = this.isSameDay(date, this.selectedDate);
            const dayEvents = this.getEventsForDate(date);

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (dayEvents.length > 0) classes += ' has-events';

            html += `<div class="${classes}" data-date="${date.toISOString()}">
                <div class="day-number">${day}</div>
                <div class="day-events">
                    ${dayEvents.slice(0, 3).map(event => `
                        <div class="day-event ${event.type}" title="${event.title}">
                            ${event.title}
                        </div>
                    `).join('')}
                    ${dayEvents.length > 3 ? `<div class="day-event more">+${dayEvents.length - 3} more</div>` : ''}
                </div>
            </div>`;
        }

        // Next month days
        const remainingCells = 42 - (startDay + totalDays);
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-day other-month">
                <div class="day-number">${day}</div>
            </div>`;
        }

        this.calendarBody.innerHTML = html;

        // Attach click handlers to days
        this.calendarBody.querySelectorAll('.calendar-day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => this.selectDate(day));
        });
    }

    attachEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.changeMonth(-1));
        this.nextBtn?.addEventListener('click', () => this.changeMonth(1));
        this.todayBtn?.addEventListener('click', () => this.goToToday());

        this.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // View change logic would go here
            });
        });
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
        this.animateTransition(delta > 0 ? 'right' : 'left');
    }

    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.render();
        this.updateSelectedDateUI();
    }

    selectDate(dayEl) {
        // Remove previous selection
        this.calendarBody.querySelectorAll('.calendar-day.selected').forEach(d => {
            d.classList.remove('selected');
        });

        // Add new selection
        dayEl.classList.add('selected');
        this.selectedDate = new Date(dayEl.dataset.date);

        this.updateSelectedDateUI();
        this.updateScheduleList();
    }

    updateSelectedDateUI() {
        const selectedDateEl = document.getElementById('selectedDate');
        if (!selectedDateEl) return;

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];

        const day = this.selectedDate.getDate();
        const weekday = dayNames[this.selectedDate.getDay()];
        const month = monthNames[this.selectedDate.getMonth()];
        const year = this.selectedDate.getFullYear();

        selectedDateEl.innerHTML = `
            <span class="date-day">${day}</span>
            <div class="date-info">
                <span class="date-weekday">${weekday}</span>
                <span class="date-full">${month} ${day}, ${year}</span>
            </div>
        `;
    }

    updateScheduleList() {
        const scheduleList = document.getElementById('scheduleList');
        if (!scheduleList) return;

        const events = this.getEventsForDate(this.selectedDate);

        if (events.length === 0) {
            scheduleList.innerHTML = `
                <div class="empty-schedule">
                    <i class="fas fa-calendar-check"></i>
                    <p>No events scheduled for this day</p>
                </div>
            `;
            return;
        }

        scheduleList.innerHTML = events.map(event => `
            <div class="schedule-item ${event.type}">
                <span class="schedule-time">${event.time}</span>
                <div class="schedule-content">
                    <span class="schedule-title">${event.title}</span>
                    <span class="schedule-location">
                        <i class="fas fa-${event.type === 'deadline' ? 'exclamation-triangle' : 'map-marker-alt'}"></i>
                        ${event.location || 'Campus'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    getEventsForDate(date) {
        return this.events.filter(event => this.isSameDay(event.date, date));
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    animateTransition(direction) {
        this.calendarBody.style.opacity = '0';
        this.calendarBody.style.transform = `translateX(${direction === 'right' ? '-20px' : '20px'})`;
        
        setTimeout(() => {
            this.calendarBody.style.transition = 'all 0.3s ease';
            this.calendarBody.style.opacity = '1';
            this.calendarBody.style.transform = 'translateX(0)';
        }, 50);

        setTimeout(() => {
            this.calendarBody.style.transition = '';
        }, 350);
    }

    addEvent(event) {
        this.events.push(event);
        this.render();
    }

    removeEvent(eventId) {
        this.events = this.events.filter(e => e.id !== eventId);
        this.render();
    }
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
});