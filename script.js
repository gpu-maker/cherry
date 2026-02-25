// ========================
// SYSTEM STATE
// ========================

let zIndex = 10;
let files = JSON.parse(localStorage.getItem("webos_files")) || {
  "welcome.txt": "Welcome to WebOS"
};

// ========================
// CLOCK
// ========================

setInterval(() => {
  document.getElementById("clock").textContent =
    new Date().toLocaleTimeString();
}, 1000);

// ========================
// WINDOW MANAGEMENT
// ========================

function openApp(id) {
  const win = document.getElementById(id);
  win.style.display = "flex";
  focusWindow(win);
}

function closeApp(id) {
  document.getElementById(id).style.display = "none";
}

function focusWindow(win) {
  zIndex++;
  win.style.zIndex = zIndex;
}

// drag windows
document.querySelectorAll(".window").forEach(makeDraggable);

function makeDraggable(win) {
  const header = win.querySelector(".titlebar");
  let offsetX = 0, offsetY = 0, dragging = false;

  header.onmousedown = e => {
    dragging = true;
    focusWindow(win);
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  };

  document.onmouseup = () => dragging = false;

  document.onmousemove = e => {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  };
}

// ========================
// FILE SYSTEM
// ========================

function saveFiles() {
  localStorage.setItem("webos_files", JSON.stringify(files));
}

function loadFiles() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  Object.keys(files).forEach(name => {
    fileList.innerHTML += `
      <div>
        <b onclick="openFile('${name}')">${name}</b>
        <button onclick="deleteFile('${name}')">X</button>
      </div>
    `;
  });
}

function createFile() {
  const name = prompt("File name:");
  if (!name) return;

  files[name] = "";
  saveFiles();
  loadFiles();
}

function deleteFile(name) {
  delete files[name];
  saveFiles();
  loadFiles();
}

function openFile(name) {
  openApp("notes");
  document.getElementById("noteArea").value = files[name];
  document.getElementById("noteArea").dataset.file = name;
}

function saveNote() {
  const area = document.getElementById("noteArea");
  const fileName = area.dataset.file || "note.txt";

  files[fileName] = area.value;
  saveFiles();
  loadFiles();
  alert("Saved");
}

// ========================
// TERMINAL (CONTROLS OS)
// ========================

function handleCommand(e) {
  if (e.key !== "Enter") return;

  const input = e.target.value;
  const output = document.getElementById("terminalOutput");
  const args = input.split(" ");

  let response = "";

  switch(args[0]) {
    case "help":
      response = `
help — commands
open [app]
files — list files
create [name]
delete [name]
clear
      `;
      break;

    case "open":
      openApp(args[1]);
      response = "Opening " + args[1];
      break;

    case "files":
      response = Object.keys(files).join(", ");
      break;

    case "create":
      files[args[1]] = "";
      saveFiles();
      loadFiles();
      response = "File created.";
      break;

    case "delete":
      delete files[args[1]];
      saveFiles();
      loadFiles();
      response = "File deleted.";
      break;

    case "clear":
      output.innerHTML = "";
      e.target.value = "";
      return;

    default:
      response = "Unknown command";
  }

  output.innerHTML += `<div>> ${input}</div><div>${response}</div>`;
  e.target.value = "";
}

// ========================
// REAL WEB BROWSER
// ========================

function loadSite(e) {
  if (e.key !== "Enter") return;

  let url = e.target.value.trim();

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  document.getElementById("browserFrame").src = url;
}

// ========================
// STARTUP
// ========================

window.onload = () => {
  loadFiles();
};
