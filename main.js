/*
    API
    id: number
    userId: number
    title: string
    completed: boolean
*/
const tasks = [];
const newTask = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const incompleteTasksDefault = document.querySelector(".incompleted");
const completeTasksDefault = document.querySelector(".completed");

///////////////////////////////////////////////////

function createNewTask(taskString, taskId) {
  const listItem = document.createElement("li");
  const inputCheckBox = document.createElement("input");
  const label = document.createElement("label");
  const editInput = document.createElement("input");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  listItem.dataset.taskId = taskId;
  inputCheckBox.type = "checkBox";
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  label.innerText = taskString;

  listItem.appendChild(inputCheckBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}
/////////////////////////////////////////////////
function createCompletedTaskElement(taskString) {
  const listItem = document.createElement("li");
  const label = document.createElement("label");
  const deleteButton = document.createElement("button");

  label.htmlFor = "complete";
  label.innerText = taskString;
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  deleteButton.onclick = (e) => {
    e.stopPropagation();
    deleteTask.bind(listItem)();
  };
  listItem.append(label, deleteButton);

  return listItem;
}
////////////////////////////////////////////////
function printIncompleteTask(taskModel) {
  const taskTitle = taskModel.title;
  const taskId = taskModel.id;

  const listItem = createNewTask(taskTitle, taskId);
  const deleteButton = listItem.querySelector(".delete");
  const checkBox = listItem.querySelector("input[type=checkbox]");
  const editButton = listItem.querySelector(".edit");
  const liItem = checkBox.parentNode;
  incompleteTasksDefault.appendChild(listItem);
  checkBox.onclick = (e) => {
    e.stopPropagation();

    const todoTitle = liItem.childNodes[1].innerText;
    completeTasksDefault.appendChild(createCompletedTaskElement(todoTitle));
    liItem.parentNode.removeChild(liItem);
  };

  deleteButton.onclick = (e) => {
    e.stopPropagation();
    deleteTask.bind(liItem)();
  };
  editButton.onclick = (e) => {
    e.stopPropagation();
    editTask(liItem);
  };
}
///////////////////////////////////////////////////
function deleteTask() {
  const parent = this.parentNode;
  parent.removeChild(this);
}
///////////////////////////////////////////////////

function addCompletedTask(taskTitle) {
  const listItem = createCompletedTaskElement(taskTitle);
  completeTasksDefault.appendChild(listItem);
}
///////////////////////////////////////////////////

function addTaskFromInput() {
  const found = tasks.find((task) => task.title === newTask.value);

  if (found) {
    alert("The same item!");
  } else {
    const createdTask = {
      title: newTask.value,
      completed: false,
      id: tasks.length + 1,
    };
    printIncompleteTask(createdTask);
    tasks.push(createdTask);
    newTask.value = "";
  }
}
///////////////////////////////////////////////////

// Ilk basta tum listeyi basan fonksiyon
function print(todoList) {
  const incompleteTasks = todoList.filter((item) => !item.completed);
  const completeTasks = todoList.filter((item) => item.completed);

  for (let i = 0; i < incompleteTasks.length; i++) {
    const task = incompleteTasks[i];
    printIncompleteTask(task);
    tasks.push(incompleteTasks[i]);
  }

  for (let i = 0; i < completeTasks.length; i++) {
    const task = completeTasks[i];
    const elem = createCompletedTaskElement(task.title);
    completeTasksDefault.appendChild(elem);
    tasks.push(completeTasks[i]);
  }
}
///////////////////////////////////////////////
async function initialize() {
  addButton.addEventListener("click", addTaskFromInput);

  const data = await fetch("https://jsonplaceholder.typicode.com/todos/").then(
    (response) => response.json()
  );
  const tasks = data.slice(0, 10);

  print(tasks);
}
initialize();

function updateTask(taskId, newTitle) {
  console.log(tasks);
}

function editTask(taskElem) {
  const liItem = taskElem;
  const editInput = liItem.querySelector("input[type=text]");
  const label = liItem.querySelector("label");
  const inEditMode = liItem.classList.contains("editMode");

  const taskId = parseInt(taskElem.dataset.taskId);
  if (inEditMode) {
    label.innerText = editInput.value;
    updateTask(taskId, editInput.value);
  } else {
    editInput.value = label.innerText;
  }

  taskElem.classList.toggle("editMode");
}
newTask.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    addTaskFromInput();
  }
});
