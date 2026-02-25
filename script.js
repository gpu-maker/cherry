// Clock
setInterval(() => {
  document.getElementById("clock").textContent =
    new Date().toLocaleTimeString();
}, 1000);

// Open/Close Apps
function openApp(id) {
  document.getElementById(id).style.display = "flex";
}

function closeApp(id) {
  document.getElementById(id).style.display = "none";
}

// Terminal
function handleCommand(e) {
  if (e.key === "Enter") {
    const input = e.target.value;
    const output = document.getElementById("terminalOutput");

    let response = "";

    switch(input.toLowerCase()) {
      case "help":
        response = "Commands: help, about, clear";
        break;
      case "about":
        response = "WebOS running in your browser.";
        break;
      case "clear":
        output.innerHTML = "";
        e.target.value = "";
        return;
      default:
        response = "Unknown command.";
    }

    output.innerHTML += `<div>> ${input}</div><div>${response}</div>`;
    e.target.value = "";
  }
}

// Notes
function saveNote() {
  const text = document.getElementById("noteArea").value;
  localStorage.setItem("webos_note", text);
  alert("Note saved!");
}

window.onload = () => {
  document.getElementById("noteArea").value =
    localStorage.getItem("webos_note") || "";
  loadFiles();
};

// Files
function loadFiles() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      fileList.innerHTML += `<div>${key}</div>`;
    }
  }
}

// Fake Browser
function loadFakeSite(e) {
  if (e.key === "Enter") {
    const url = e.target.value.toLowerCase();
    const content = document.getElementById("browserContent");

    if (url.includes("google")) {
      content.innerHTML = "<h2>Fake Google</h2><p>This is a simulation.</p>";
    } else if (url.includes("github")) {
      content.innerHTML = "<h2>Fake GitHub</h2><p>Repositories loading...</p>";
    } else {
      content.innerHTML = "<h2>404</h2><p>Site not found.</p>";
    }
  }
}
