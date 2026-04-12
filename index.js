/**
 * Premium Todo Card Logic
 * Vanilla JavaScript implementation for HNG task.
 */

document.addEventListener('DOMContentLoaded', () => {
    const todoToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
    const todoTitle = document.querySelector('[data-testid="test-todo-title"]');
    const todoStatus = document.querySelector('[data-testid="test-todo-status"]');
    const timeRemainingEl = document.getElementById('time-remaining');
    const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
    const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
    const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

    // Get due date from HTML attribute
    const dueDateStr = dueDateEl.getAttribute('datetime');
    const dueDate = new Date(dueDateStr);

    /**
     * Calculates and formats the time remaining string
     */
    function updateTimeRemaining() {
        const now = new Date();
        const diffMs = dueDate - now;
        const diffAbs = Math.abs(diffMs);
        
        const seconds = Math.floor(diffAbs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let resultMessage = "";

        if (diffMs < 0) {
            // Overdue
            if (hours < 1) {
                resultMessage = `Overdue by ${minutes} minutes`;
            } else if (hours < 24) {
                resultMessage = `Overdue by ${hours} hour${hours > 1 ? 's' : ''}`;
            } else {
                resultMessage = `Overdue by ${days} day${days > 1 ? 's' : ''}`;
            }
        } else {
            // Future due
            if (minutes < 1) {
                resultMessage = "Due now!";
            } else if (hours < 1) {
                resultMessage = `Due in ${minutes} minutes`;
            } else if (hours < 24) {
                resultMessage = `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
            } else if (days === 1) {
                resultMessage = "Due tomorrow";
            } else {
                resultMessage = `Due in ${days} days`;
            }
        }

        timeRemainingEl.textContent = resultMessage;
    }

    /**
     * Handles the completion toggle behavior
     */
    function handleToggle() {
        if (todoToggle.checked) {
            todoTitle.classList.add('completed');
            todoStatus.textContent = 'Done';
            todoStatus.classList.remove('status-pending');
            todoStatus.classList.add('status-done');
            todoStatus.setAttribute('aria-label', 'Current status: Done');
        } else {
            todoTitle.classList.remove('completed');
            todoStatus.textContent = 'Pending';
            todoStatus.classList.remove('status-done');
            todoStatus.classList.add('status-pending');
            todoStatus.setAttribute('aria-label', 'Current status: Pending');
        }
    }

    // Initialize
    updateTimeRemaining();
    handleToggle();

    // Event Listeners
    todoToggle.addEventListener('change', handleToggle);

    editBtn.addEventListener('click', () => {
        console.log("Edit clicked: Navigate to edit mode...");
        // In a real app, this might open a modal or change the card to an input form
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this task?")) {
            console.log("Delete clicked: Removing task...");
            document.querySelector('[data-testid="test-todo-card"]').style.opacity = '0.5';
            document.querySelector('[data-testid="test-todo-card"]').style.pointerEvents = 'none';
            alert("Delete clicked (Simulation)");
        }
    });

    // Refresh time every 60 seconds
    setInterval(updateTimeRemaining, 60000);
});
