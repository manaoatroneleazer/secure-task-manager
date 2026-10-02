// data.js — application data and ID generation

export var SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

export var taskCounter = 0;

export function generateTaskId() {
  taskCounter++;
  return "task-" + taskCounter;
}
