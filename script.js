const form = document.querySelector("form");
const input = document.querySelector(".title");
const item = document.querySelector(".item");
const count = document.querySelector(".countWrapper");

let todos = [];

const addToLocalStorage = () => {
  if (todos.length > 0) {
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    localStorage.removeItem("todos");
  }
};

const getFromLocalStorage = () => {
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
    renderTodoItems();
  }
};

const createTodo = () => {
  const task = {
    id: new Date().toISOString(),
    title: input.value,
    status: false,
    date: new Date(),
  };
  input.value = "";
  todos = [...todos, task];
  addToLocalStorage();
  renderTodoItems();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  createTodo();
});

const renderTodoItems = () => {
  item.innerHTML = "";
  todos.forEach((el, index) => {
    const wrap = document.createElement("div");
    const title = document.createElement("p");
    const text = document.createElement("p");
    const dateText = document.createElement("p");
    const edit = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const toggleStatus = document.createElement("button");
    title.textContent = `${index + 1}) ${el.title}`;
    edit.textContent = "edit";
    deleteBtn.textContent = "delete";
    toggleStatus.textContent = el.status ? "done" : "not done";
    text.className = "statusText";

    text.textContent = el.status ? "completed" : "processing";
    dateText.textContent = generateDate(el.date);

    wrap.append(title, edit, deleteBtn, toggleStatus, text, dateText);
    item.append(wrap);

    edit.addEventListener("click", () => {
      editTodo(el.id);
    });
    deleteBtn.addEventListener("click", () => {
      deleteTodo(el.id);
    });
    toggleStatus.addEventListener("click", () => {
      toggleStatusTodo(el.id);
    });
  });
  generateCountItems();
  const clear = document.querySelector(".clear");
  clear.style.display = todos.length > 0 ? "block" : "none";
};

const editTodo = (id) => {
  const editMessage = prompt("Edit Todo");
  if (!editMessage) {
    return "";
  }
  todos = todos.map((el) => {
    if (el.id === id) {
      return { ...el, title: editMessage };
    }
    return el;
  });
  addToLocalStorage();
  renderTodoItems();
};

const deleteTodo = (id) => {
  todos = todos.filter((el) => el.id !== id);
  addToLocalStorage();
  renderTodoItems();
};

const toggleStatusTodo = (id) => {
  todos = todos.map((el) => {
    if (el.id === id) {
      return { ...el, status: !el.status };
    }
    return el;
  });
  addToLocalStorage();
  renderTodoItems();
};

const generateCountItems = () => {
  const lengthTodo = todos.length;
  const completedLength = todos.filter((el) => el.status).length;
  const processingLength = todos.filter((el) => !el.status).length;
  const counter = `<p>all: ${lengthTodo}</p> <p>done: ${completedLength}</p> <p>undone: ${processingLength}</p>`;
  count.innerHTML = lengthTodo > 0 ? counter : "";
};

const clearAllTodos = () => {
  const clear = document.querySelector(".clear");
  clear.style.display = "none";
  clear.addEventListener("click", () => {
    todos = [];
    addToLocalStorage();
    renderTodoItems();
    count.innerHTML = "";
  });
};
clearAllTodos();

const generateDate = (dateParams) => {
  const date =
    typeof dateParams === "string"
      ? new Date(dateParams)
      : typeof dateParams === "object"
      ? dateParams
      : null;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const generateNewTime = (time) => {
    return time < 10 ? "0" + time : time;
  };

  const [newMinutes, newSeconds, newDay, newMonth] = [
    minutes,
    seconds,
    day,
    month,
  ].map((el) => generateNewTime(el));

  const currentDate = `Date now: ${newDay} - ${newMonth} - ${year} ${hours}:${newMinutes}:${newSeconds}`;
  return currentDate;
};

getFromLocalStorage();
