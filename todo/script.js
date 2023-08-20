function uidGen() {
  const timestamp = new Date().getTime();
  return timestamp;
}

function renderTasks() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));

    const task = JSON.parse(localStorage.getItem(localStorage.key(i)));

    const htmlToAdd =
      '<li id="' +
      localStorage.key(i) +
      '">\
        <div class="task">\
            <p>' +
      task.task +
      '</p>\
            <div class="buttons">\
                <button class="done btn" onclick="updateStatus()">' +
      (task.status ? 'Done' : 'Undone') +
      '</button>\
                  <button class="delete btn" onclick="delTask()">Delete</button>\
            </div>\
        </div>\
    </li>';
    if (document.getElementById("no-task-placeholder")) {
      document.getElementById("task-list").removeChild(document.getElementById("no-task-placeholder"));
    }
    document.getElementById("task-list").innerHTML += htmlToAdd;
  }
}

document.getElementById("task-submit").addEventListener("click", function () {

  if (document.getElementById("add-task").value == "") {
    alert("Field cannot be empty");
    return;
  }
  
  const task = document.getElementById("add-task").value;

  const uid = uidGen();

  localStorage.setItem(uid, JSON.stringify({ task: task, status: false }));

  document.getElementById("task").value = "";
});

function delTask() {
  const id = event.target.parentNode.parentNode.parentNode.id;
  localStorage.removeItem(id);
  location.reload();
}

function updateStatus() {
  const el = event.target.parentNode.parentNode.parentNode.id;

  const task = JSON.parse(localStorage.getItem(el)).task;
  localStorage.setItem(el, JSON.stringify({ task: task, status: (JSON.parse(localStorage.getItem(el)).status ? false : true) }));
  location.reload();
}

function clr() {
  localStorage.clear();
  location.reload();
}

console.log(localStorage);
console.log(localStorage.key(0));
renderTasks();
