const openPopup = document.getElementById("open_popup");
const closePopup = document.getElementById("popup_close");
const popUp = document.getElementById("popup");
const form = document.querySelector("#form");
const valueInput = document.getElementById("input");
const tasksList = document.querySelector("#taskList");
const emptyList = document.querySelector("#emptyList");

window.addEventListener("load", async() => {
  if('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
      console.log('[ServiceWorker] Registered');
    } catch (error) {
      console.log('[ServiceWorker] Error', error);
    }
  }
})

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

openPopup.addEventListener("click", () => {
  popUp.classList.add("active");
  setFocusToTextBox();
});

closePopup.addEventListener("click", () => {
  popUp.classList.remove("active");
});

// Add task
form.addEventListener("submit", addTask);

function addTask(event) {
  event.preventDefault();

  const taskText = valueInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocslStorage();

  renderTask(newTask);

  valueInput.value = "";
  valueInput.focus();

  checkEmptyList();
}

// Delete task
tasksList.addEventListener("click", deleteTask);

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parenNode = event.target.closest(".list-grup-item");

  const id = Number(parenNode.id);

  tasks = tasks.filter((task) => task.id !== id);

  saveToLocslStorage();

  parenNode.remove();

  checkEmptyList();
}

// Done task
tasksList.addEventListener("click", doneTask);

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-grup-item");

  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  saveToLocslStorage();

  const taskTitle = parentNode.querySelector(".task-title");

  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
            <li id="emptyList">
              <img src="./img/empty-folder64.png" alt="">
              <div class="emty-list_title">Сисок дел пуст</div>
            </li>`;

    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocslStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHTML = `
      <li id="${task.id}" class="list-grup-item">
          <span class="${cssClass}">${task.text}</span>
          <div class="task-item_buttons">
              <button type="button" data-action="done" class="done">
                  <img src="./img/done.png" alt="done" id="img_done">
              </button>
              <button type="button" data-action="delete" class="delete">
                  <img src="./img/delete.png" alt="delete" id="img_delete">
              </button>
          </div>
      </li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

function setFocusToTextBox() {
  document.getElementById("input").focus();
}
