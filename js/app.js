// ─── Data ────────────────────────────────────────────────────────────────────

var SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

var taskCounter = 0;

// ─── DOM References ───────────────────────────────────────────────────────────

var taskInput      = document.getElementById("taskInput");
var addTaskBtn     = document.getElementById("addTaskBtn");
var loadSamplesBtn = document.getElementById("loadSamplesBtn");
var taskList       = document.getElementById("taskList");
var taskMessage    = document.getElementById("taskMessage");
var totalCount     = document.getElementById("totalCount");
var pendingCount   = document.getElementById("pendingCount");
var completedCount = document.getElementById("completedCount");

// ─── Required Functions ───────────────────────────────────────────────────────

function createTaskElement(taskText, taskId) {
  var taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  var textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  var completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  var editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  var removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  taskItem.appendChild(textSpan);
  taskItem.appendChild(completeBtn);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(removeBtn);

  return taskItem;
}

function addTask(taskText) {
  var trimmed = taskText.trim();

  if (trimmed === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskCounter++;
  var taskId = "task-" + taskCounter;

  taskList.appendChild(createTaskElement(trimmed, taskId));
  taskInput.value = "";
  taskMessage.textContent = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  taskItem.dataset.state = taskItem.classList.contains("completed")
    ? "completed"
    : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  var textSpan = taskItem.querySelector(".task-text");
  var editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  var editInput = taskItem.querySelector(".edit-input");
  var trimmed = editInput.value.trim();

  if (trimmed === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  var textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = trimmed;

  editInput.replaceWith(textSpan);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  taskMessage.textContent = "";
  updateTaskCounts();
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  var items     = taskList.querySelectorAll(".task-item");
  var pending   = taskList.querySelectorAll('.task-item[data-state="pending"]');
  var completed = taskList.querySelectorAll('.task-item[data-state="completed"]');

  totalCount.textContent     = items.length;
  pendingCount.textContent   = pending.length;
  completedCount.textContent = completed.length;
}

function handleTaskListClick(event) {
  var taskItem = event.target.closest(".task-item");

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
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < SAMPLE_TASKS.length; i++) {
    taskCounter++;
    var taskId = "task-" + taskCounter;
    fragment.appendChild(createTaskElement(SAMPLE_TASKS[i], taskId));
  }

  taskList.appendChild(fragment);
  updateTaskCounts();
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

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
