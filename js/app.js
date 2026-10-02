// app.js — main entry point

import { SAMPLE_TASKS, generateTaskId } from "./data.js";
import { validateTaskText, showMessage, clearMessage } from "./utils.js";
import { createTaskElement, createTextSpan, updateTaskCounts } from "./display.js";

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

function addTask(taskText) {
  var text = validateTaskText(taskText);

  if (text === null) {
    showMessage(taskMessage, "Task cannot be empty");
    return;
  }

  taskList.appendChild(createTaskElement(text, generateTaskId()));
  taskInput.value = "";
  clearMessage(taskMessage);
  updateTaskCounts(taskList, totalCount, pendingCount, completedCount);
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  taskItem.dataset.state = taskItem.classList.contains("completed")
    ? "completed"
    : "pending";
  updateTaskCounts(taskList, totalCount, pendingCount, completedCount);
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
  var text = validateTaskText(editInput.value);

  if (text === null) {
    showMessage(taskMessage, "Task cannot be empty");
    return;
  }

  editInput.replaceWith(createTextSpan(text));
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  clearMessage(taskMessage);
  updateTaskCounts(taskList, totalCount, pendingCount, completedCount);
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts(taskList, totalCount, pendingCount, completedCount);
}

function handleTaskListClick(event) {
  var taskItem = event.target.closest(".task-item");

  if (!taskItem) { return; }

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
    fragment.appendChild(createTaskElement(SAMPLE_TASKS[i], generateTaskId()));
  }

  taskList.appendChild(fragment);
  updateTaskCounts(taskList, totalCount, pendingCount, completedCount);
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
