document.addEventListener("DOMContentLoaded", () => {
  const todoCard = document.getElementById("todo-card");
  const todoToggle = document.getElementById("todo-toggle");
  const todoTitle = document.getElementById("todo-title");
  const statusDisplay = document.getElementById("status-display");
  const statusControl = document.getElementById("status-control");
  const priorityDisplay = document.getElementById("priority-display");
  const dueDateDisplay = document.getElementById("due-date-display");
  const timeRemainingEl = document.getElementById("time-remaining");
  const todoDesc = document.querySelector(
    '[data-testid="test-todo-description"]',
  );
  const collapsibleSection = document.getElementById("todo-desc-section");
  const expandToggle = document.getElementById("expand-toggle");

  const editBtn = document.getElementById("edit-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const editForm = document.getElementById("edit-form");
  const cancelBtn = document.getElementById("cancel-btn");

  const editTitleInput = document.getElementById("edit-title");
  const editDescInput = document.getElementById("edit-desc");
  const editPrioritySelect = document.getElementById("edit-priority");
  const editDueDateInput = document.getElementById("edit-due-date");

  let state = {
    title: todoTitle.textContent.trim(),
    description: todoDesc.textContent.trim(),
    status: statusControl.value,
    priority: "High",
    dueDate: new Date(dueDateDisplay.getAttribute("datetime")),
    isExpanded: false,
  };

  function renderUI() {
    todoTitle.textContent = state.title;
    todoDesc.textContent = state.description;

    statusDisplay.textContent = state.status;
    statusDisplay.setAttribute("aria-label", `Current status: ${state.status}`);
    statusControl.value = state.status;
    todoToggle.checked = state.status === "Done";

    statusDisplay.className = `badge status-badge-${state.status.toLowerCase().replace(" ", "-")}`;
    if (state.status === "Done") {
      todoTitle.classList.add("completed");
      todoCard.classList.add("status-done");
    } else {
      todoTitle.classList.remove("completed");
      todoCard.classList.remove("status-done");
    }

    const priorityOuter = priorityDisplay.closest(".badge");
    priorityDisplay.textContent = state.priority;
    priorityOuter.setAttribute("aria-label", `Priority: ${state.priority}`);
    priorityOuter.className = `badge priority-badge-${state.priority.toLowerCase()}`;

    todoCard.classList.remove(
      "priority-low",
      "priority-medium",
      "priority-high",
    );
    todoCard.classList.add(`priority-${state.priority.toLowerCase()}`);

    dueDateDisplay.textContent = `Due ${state.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    dueDateDisplay.setAttribute("datetime", state.dueDate.toISOString());

    updateTimeLogic();
    checkExpandability();
  }

  function updateTimeLogic() {
    if (state.status === "Done") {
      timeRemainingEl.textContent = "Completed";
      todoCard.classList.remove("is-overdue");
      return;
    }

    const now = new Date();
    const diffMs = state.dueDate - now;
    const diffAbs = Math.abs(diffMs);

    const minutes = Math.floor(diffAbs / (1000 * 60));
    const hours = Math.floor(diffAbs / (1000 * 60 * 60));
    const days = Math.floor(diffAbs / (1000 * 60 * 60 * 24));

    let resultMessage = "";
    const isOverdue = diffMs < 0;

    if (isOverdue) {
      todoCard.classList.add("is-overdue");
      if (minutes < 60) resultMessage = `Overdue by ${minutes} minutes`;
      else if (hours < 24)
        resultMessage = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
      else resultMessage = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
    } else {
      todoCard.classList.remove("is-overdue");
      if (minutes < 1) resultMessage = "Due now!";
      else if (minutes < 60) resultMessage = `Due in ${minutes} minutes`;
      else if (hours < 24)
        resultMessage = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
      else resultMessage = `Due in ${days} day${days > 1 ? "s" : ""}`;
    }

    timeRemainingEl.textContent = resultMessage;
  }

  function toggleExpand() {
    state.isExpanded = !state.isExpanded;
    collapsibleSection.classList.toggle("collapsed", !state.isExpanded);
    expandToggle.setAttribute("aria-expanded", state.isExpanded);
    expandToggle.querySelector(".btn-text").textContent = state.isExpanded
      ? "Show less"
      : "Show more";
  }

  function checkExpandability() {
    if (state.description.length > 100) {
      expandToggle.style.display = "flex";
    } else {
      expandToggle.style.display = "none";
      collapsibleSection.classList.remove("collapsed");
    }
  }

  todoToggle.addEventListener("change", () => {
    state.status = todoToggle.checked ? "Done" : "Pending";
    renderUI();
  });

  statusControl.addEventListener("change", () => {
    state.status = statusControl.value;
    renderUI();
  });

  expandToggle.addEventListener("click", toggleExpand);

  editBtn.addEventListener("click", () => {
    editTitleInput.value = state.title;
    editDescInput.value = state.description;
    editPrioritySelect.value = state.priority;

    const date = state.dueDate;
    const formattedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
    editDueDateInput.value = formattedDate;

    todoCard.classList.add("is-editing");
    editTitleInput.focus();
  });

  cancelBtn.addEventListener("click", () => {
    todoCard.classList.remove("is-editing");
    editBtn.focus();
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    state.title = editTitleInput.value;
    state.description = editDescInput.value;
    state.priority = editPrioritySelect.value;
    state.dueDate = new Date(editDueDateInput.value);

    todoCard.classList.remove("is-editing");
    renderUI();
    editBtn.focus();
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      todoCard.style.opacity = "0.5";
      todoCard.style.pointerEvents = "none";
      alert("Delete simulated!");
    }
  });

  setInterval(updateTimeLogic, 30000);

  renderUI();
});
