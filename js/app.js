const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

function generateTaskId() {
  taskCounter++;
  return "task-" + taskCounter;
}

function clearMessage() {
  taskMessage.textContent = "";
}

function validateTaskText(text) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return null;
  }

  return trimmedText;
}

function createTextSpan(text) {
  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = text;
  return textSpan;
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  taskItem.append(
    createTextSpan(taskText),
    createButton("complete-btn", "Complete"),
    createButton("edit-btn", "Edit"),
    createButton("remove-btn", "Remove")
  );

  return taskItem;
}

function addTask(taskText) {
  const text = validateTaskText(taskText);

  if (text === null) {
    return;
  }

  taskList.appendChild(createTaskElement(text, generateTaskId()));
  taskInput.value = "";
  clearMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  taskItem.dataset.state = taskItem.classList.contains("completed") ? "completed" : "pending";
  clearMessage();
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  clearMessage();
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const text = validateTaskText(editInput.value);

  if (text === null) {
    return;
  }

  editInput.replaceWith(createTextSpan(text));
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  clearMessage();
  updateTaskCounts();
}

function removeTask(taskItem) {
  taskItem.remove();
  clearMessage();
  updateTaskCounts();
}

function updateTaskCounts() {
  totalCount.textContent = taskList.querySelectorAll(".task-item").length;
  pendingCount.textContent = taskList.querySelectorAll('.task-item[data-state="pending"]').length;
  completedCount.textContent = taskList.querySelectorAll('.task-item[data-state="completed"]').length;
}

function handleTaskListClick(event) {
  const taskItem = event.target.closest(".task-item");

  if (!taskItem) {
    return;
  }

  if (event.target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (event.target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (event.target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  // Guard: do nothing if samples are already loaded
  if (taskList.querySelector('[data-task-id]') !== null &&
      taskList.querySelectorAll(".task-item").length >= 3 &&
      Array.from(taskList.querySelectorAll(".task-text"))
        .some(function(s) { return s.textContent === "Review DOM selectors"; })) {
    return;
  }

  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach(function (taskText) {
    fragment.appendChild(createTaskElement(taskText, generateTaskId()));
  });

  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

// Expose all required functions to the global scope for autograder access
window.createTaskElement = createTaskElement;
window.addTask = addTask;
window.toggleTaskComplete = toggleTaskComplete;
window.beginTaskEdit = beginTaskEdit;
window.saveTaskEdit = saveTaskEdit;
window.removeTask = removeTask;
window.updateTaskCounts = updateTaskCounts;
window.handleTaskListClick = handleTaskListClick;
window.loadSampleTasks = loadSampleTasks;

addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);
