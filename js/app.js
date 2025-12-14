// File: js/app.js
// Student: Jumana Salahat (12429912)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.
const STUDENT_ID = "12429912";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const statusDiv = document.getElementById("status");

function setStatus(message, isError = false) {
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666";
}

document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
  setStatus("Loading tasks...");
  try {
    const url = `${API_BASE}/get.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;
    const res = await fetch(url);
    const data = await res.json();

    list.innerHTML = "";
    if (data.tasks && data.tasks.length > 0) {
      data.tasks.forEach(task => appendTaskToList(task));
      setStatus("Tasks loaded");
    } else {
      setStatus("No tasks found");
    }
  } catch (err) {
    console.error(err);
    setStatus("Failed to load tasks", true);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  setStatus("Adding task...");

  try {
    const url = `${API_BASE}/add.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });

    const data = await res.json();

    if (data.task) {
      appendTaskToList(data.task);
      input.value = "";
      setStatus("Task added");
    } else {
      setStatus(data.message || "Failed to add task", true);
    }
  } catch (err) {
    console.error(err);
    setStatus("Error adding task", true);
  }
});

function appendTaskToList(task) {
  const li = document.createElement("li");
  li.textContent = task.title + " ";

  const btn = document.createElement("button");
  btn.textContent = "Delete";
  btn.onclick = () => deleteTask(task.id, li);

  li.appendChild(btn);
  list.appendChild(li);
}

async function deleteTask(id, liElement) {
  if (!confirm("Delete this task?")) return;

  try {
    const url = `${API_BASE}/delete.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}&id=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      liElement.remove();
      setStatus("Task deleted");
    } else {
      setStatus(data.message || "Failed to delete task", true);
    }
  } catch (err) {
    console.error(err);
    setStatus("Error deleting task", true);
  }
}
