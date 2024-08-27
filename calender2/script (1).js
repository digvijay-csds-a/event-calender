const calendarBody = document.getElementById('calendarBody');
const currentMonth = document.getElementById('currentMonth');
const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
const eventForm = document.getElementById('eventForm');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const eventTime = document.getElementById('eventTime');
const deleteEventBtn = document.getElementById('deleteEvent');
let currentYear, month, selectedDate, editingEventIndex = null;

const events = JSON.parse(localStorage.getItem('events')) || {};

function initCalendar() {
    const now = new Date();
    currentYear = now.getFullYear();
    month = now.getMonth();
    renderCalendar();
}
function renderCalendar() {
    calendarBody.innerHTML = '';
    const firstDay = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const now = new Date();
    currentMonth.innerText = `${new Date(currentYear, month).toLocaleString('default', { month: 'long' })} ${currentYear}`;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.innerText = '';
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.innerText = date;
                const fullDate = `${currentYear}-${month + 1}-${date}`;

                if (now.getDate() === date && now.getMonth() === month && now.getFullYear() === currentYear) {
                    cell.innerHTML = `<span class="current-date">${date}</span>`;
                } else {
                    cell.innerText = date;
                }

                if (events[fullDate]) {
                    events[fullDate].forEach((event, index) => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.innerText = `${event.time} - ${event.title}`;
                        eventDiv.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openModal(fullDate, index);
                        });
                        cell.appendChild(eventDiv);
                    });
                }

                cell.addEventListener('click', () => openModal(fullDate));
                date++;
            }
            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
  
}

function openModal(date, eventIndex = null) {
    selectedDate = date;
    editingEventIndex = eventIndex;

    if (eventIndex !== null) {
        const event = events[date][eventIndex];
        eventTitle.value = event.title;
        eventDescription.value = event.description;
        eventTime.value = event.time;
        deleteEventBtn.style.display = 'block';
    } else {
        eventForm.reset();
        deleteEventBtn.style.display = 'none';
    }

    eventModal.show();
}

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = eventTitle.value;
    const description = eventDescription.value;
    const time = eventTime.value;

    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }

    if (editingEventIndex !== null) {
        events[selectedDate][editingEventIndex] = { title, description, time };
    } else {
        events[selectedDate].push({ title, description, time });
    }

    localStorage.setItem('events', JSON.stringify(events));
    eventModal.hide();
    renderCalendar();

    // Add an alert here to notify the user
    alert('Event added successfully!');
});

deleteEventBtn.addEventListener('click', () => {
    if (editingEventIndex !== null) {
        events[selectedDate].splice(editingEventIndex, 1);
        if (events[selectedDate].length === 0) {
            delete events[selectedDate];
        }
        localStorage.setItem('events', JSON.stringify(events));
        eventModal.hide();
        renderCalendar();
    }
});

document.getElementById('prevMonth').addEventListener('click', () => {
    month--;
    if (month < 0) {
        month = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    month++;
    if (month > 11) {
        month = 0;
        currentYear++;
    }
    renderCalendar();
});

initCalendar();
