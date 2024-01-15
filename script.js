document.addEventListener("DOMContentLoaded", function() {
    generateCalendar();
    updateDate();
    loadTasks();
});

function generateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear previous content

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Add days of the week
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        calendarContainer.appendChild(dayElement);
    });

    // Fill in the calendar with dates
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        calendarContainer.appendChild(emptyDay);
    }

    for (let date = 1; date <= daysInMonth; date++) {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = date;
        dateElement.addEventListener('click', function() {
            handleDateClick(currentYear, currentMonth, date);
        });
        calendarContainer.appendChild(dateElement);
    }

    markToday(currentYear, currentMonth, currentDate.getDate());
}

function markToday(year, month, day) {
    const todayIndex = new Date(year, month, day).getDay() === 0 ? 6 : new Date(year, month, day).getDay() - 1;
    const dateElements = document.querySelectorAll('.date');
    dateElements[todayIndex].classList.add('today');
}

function updateDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').innerHTML = currentDate.toLocaleDateString('en-US', options);
}

function prevMonth() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
    updateDate();
}

function nextMonth() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
    updateDate();
}

function handleDateClick(year, month, day) {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    const taskItem = document.createElement('li');
    taskItem.innerHTML = `<input type="checkbox" onchange="updateTaskStatus(this)">
                          <span>${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}</span>
                          ${taskInput.value} 
                          <button onclick="removeTask(this)">Remove</button>`;
    taskList.appendChild(taskItem);

    saveTask({
        date: `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        task: taskInput.value
    });

    taskInput.value = '';
}

function addTask() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    handleDateClick(currentYear, currentMonth, currentDay);
}

function updateTaskStatus(checkbox) {
    const taskItem = checkbox.parentElement;
    const taskText = taskItem.querySelector('span').innerText;

    if (checkbox.checked) {
        // Task is done
        taskItem.querySelector('span').style.textDecoration = 'line-through';
        setTimeout(() => {
            removeTaskFromStorage(taskText);
            taskItem.remove();
        }, 500); // Wait 500ms before removing for visual effect
    } else {
        // Task is not done, move to the next day
        removeTaskFromStorage(taskText);
        const [year, month, day] = taskText.split('-').map(Number);
        const nextDay = new Date(year, month - 1, day + 1);
        handleDateClick(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());
        taskItem.remove();
    }
}

function removeTask(button) {
    const taskItem = button.parentElement;
    const taskText = taskItem.querySelector('span').innerText;
    const taskList = document.getElementById('taskList');

    taskList.removeChild(taskItem);

    removeTaskFromStorage(taskText);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(date) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.date !== date);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `<input type="checkbox" onchange="updateTaskStatus(this)">
                              <span>${task.date}</span>
                              ${task.task} 
                              <button onclick="removeTask(this)">Remove</button>`;
        taskList.appendChild(taskItem);
    });
}
