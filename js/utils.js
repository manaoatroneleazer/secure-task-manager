// utils.js — validation and message utilities

export function validateTaskText(text) {
  return text.trim() === "" ? null : text.trim();
}

export function showMessage(element, message) {
  element.textContent = message;
}

export function clearMessage(element) {
  element.textContent = "";
}
