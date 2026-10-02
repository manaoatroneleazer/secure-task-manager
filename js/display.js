// display.js — DOM creation and task display operations

export function createTextSpan(text) {
  var span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;
  return span;
}

export function createButton(className, label) {
  var btn = document.createElement("button");
  btn.classList.add(className);
  btn.textContent = label;
  return btn;
}

export function createTaskElement(taskText, taskId) {
  var taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  taskItem.appendChild(createTextSpan(taskText));
  taskItem.appendChild(createButton("complete-btn", "Complete"));
  taskItem.appendChild(createButton("edit-btn", "Edit"));
  taskItem.appendChild(createButton("remove-btn", "Remove"));

  return taskItem;
}

export function updateTaskCounts(taskList, totalCount, pendingCount, completedCount) {
  totalCount.textContent     = taskList.querySelectorAll(".task-item").length;
  pendingCount.textContent   = taskList.querySelectorAll('.task-item[data-state="pending"]').length;
  completedCount.textContent = taskList.querySelectorAll('.task-item[data-state="completed"]').length;
}
