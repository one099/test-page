const input = document.getElementsByClassName("task-inp")[0];
const inp_btn = document.getElementById("submit-btn");
const clear_btn = document.getElementById("clear-btn");
const task_cont = document.getElementById("tasks");
const add_task = document.getElementsByClassName("add-task")[0];

if (localStorage.getItem("taskList") === null){
  let str = "[]" 
  localStorage.setItem("taskList", str);
} 

let taskList = JSON.parse(localStorage.getItem("taskList"));

taskReload();

clear_btn.addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.setItem("taskList", "[]");
  taskList = [];
  taskReload();
});

add_task.addEventListener("submit", () => newTask((new Date()).getTime(), input.value, false));

function newTask(id, name, status) {
  if ( name !== "" ) {
    taskList.push({
      id: id,
      name: name,
      status: status,
    });
    input.value = "";
    localStorage.setItem("taskList", JSON.stringify(taskList));
    taskReload();
  } else {
    alert("Input field can't be empty!");
  }
}

function taskReload() {
  while( task_cont.firstChild !== null ){
    task_cont.removeChild(task_cont.firstChild);
  }

  taskList = JSON.parse(localStorage.getItem("taskList"));
  
  if (taskList.length > 0) {
    taskList.forEach((element) => {
      task_cont.style.borderWidth = "1px";
      let child = taskItem(element.id, element.name, element.status);
      task_cont.appendChild(child);
    });
  } else {
    task_cont.style.borderWidth = "0";
  }
  if ( detectMob() == false) {
    input.focus();
  }
}

function taskItem(id, name, status) {
  let elem = document.createElement("div");
  elem.setAttribute("id", id);
  elem.setAttribute("class", "task-item");

  let elemP = document.createElement("p");
  elemP.innerText = name;
  elemP.setAttribute("class", "task-name");

  let elemTBtn = document.createElement("div");
  elemTBtn.setAttribute("class", "taskmg-btns");
  
  let stateBtn = document.createElement("button");
  stateBtn.setAttribute("class", "task-btn");
  stateBtn.innerText = status ? "Done" : "Not-Done";
  stateBtn.addEventListener("click", (e) => {
    changeState(id, !status);
  })

  let rmBtn = document.createElement("button");
  rmBtn.setAttribute("class", "task-btn");
  rmBtn.innerText = "Remove";
  rmBtn.addEventListener("click", () => {
    removeItem(id);
  })

  elemTBtn.appendChild(stateBtn);
  elemTBtn.appendChild(rmBtn);
  
  elem.appendChild(elemP);
  elem.appendChild(elemTBtn);
  
  return elem;
};

function changeState(id, status) {
  taskList.forEach(element => {
    if ( id == element.id ) {
      element.status = status;
    }
  });
  
  localStorage.setItem("taskList", JSON.stringify(taskList));
  taskReload();
}

function removeItem(id) {
  let rmIndex;
  taskList.forEach((element, index) => {
    if (element.id === id) {
      rmIndex = index;
    }
  });
  taskList.splice(rmIndex, 1);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  taskReload();
}

function detectMob() {
  const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];
  
  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
  });
}
