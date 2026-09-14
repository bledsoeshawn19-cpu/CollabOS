const windowArea = document.getElementById("window-area");
const taskbarApps = document.getElementById("taskbar-apps");
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const contextMenu = document.getElementById("context-menu");
const clock = document.getElementById("clock");

let zIndex = 10;
let windowCount = 0;
const openWindows = new Map();

const appData = {
  files: {
    title: "File Manager",
    icon: "📁",
    width: 700,
    height: 470
  },
  chat: {
    title: "Live Chat",
    icon: "💬",
    width: 760,
    height: 500
  },
  editor: {
    title: "Collaborative Editor",
    icon: "📝",
    width: 800,
    height: 550
  },
  whiteboard: {
    title: "Whiteboard",
    icon: "🎨",
    width: 700,
    height: 500
  },
  admin: {
    title: "Admin Console",
    icon: "🛡️",
    width: 760,
    height: 500
  },
  settings: {
    title: "Settings",
    icon: "⚙️",
    width: 600,
    height: 430
  }
};

function updateClock() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

setInterval(updateClock, 1000);
updateClock();

function getAppContent(appId) {
  switch (appId) {
    case "files":
      return `
        <h2>File Manager</h2>
        <p>Organize your documents, folders, uploads, and shared files.</p>

        <div class="admin-grid">
          <div class="admin-card">
            <h3>📁 My Documents</h3>
            <p>12 documents</p>
          </div>
          <div class="admin-card">
            <h3>⭐ Starred</h3>
            <p>4 starred files</p>
          </div>
          <div class="admin-card">
            <h3>🤝 Shared With Me</h3>
            <p>8 shared files</p>
          </div>
          <div class="admin-card">
            <h3>🗑️ Trash</h3>
            <p>Recently deleted items</p>
          </div>
        </div>
      `;

    case "chat":
      return `
        <div class="chat-layout">
          <aside class="chat-sidebar">
            <h3>CHANNELS</h3>
            <button class="channel active"># general</button>
            <button class="channel"># announcements</button>
            <button class="channel"># projects</button>
            <button class="channel"># random</button>

            <h3>DIRECT MESSAGES</h3>
            <button class="channel">🟢 Alex</button>
            <button class="channel">🟡 Jordan</button>
          </aside>

          <section class="chat-main">
            <div class="chat-messages" id="chat-messages">
              <div class="message">
                <strong>System</strong>
                <small>now</small>
                <div>Welcome to the live workspace.</div>
              </div>

              <div class="message">
                <strong>Alex</strong>
                <small>now</small>
                <div>We can edit documents together here.</div>
              </div>
            </div>

            <form class="chat-input" id="chat-form">
              <input
                id="chat-message-input"
                placeholder="Message #general..."
                autocomplete="off"
              />
              <button class="primary-button">Send</button>
            </form>
          </section>
        </div>
      `;

    case "editor":
      return `
        <h2>Collaborative Editor</h2>

        <div class="editor-toolbar">
          <button data-format="bold"><b>B</b></button>
          <button data-format="italic"><i>I</i></button>
          <button data-format="underline"><u>U</u></button>
          <button id="save-document">Save</button>
          <button id="share-document">Share</button>
        </div>

        <textarea
          class="editor-area"
          id="editor-area"
          placeholder="Start writing with your team..."
        ></textarea>
      `;

    case "whiteboard":
      return `
        <h2>Collaborative Whiteboard</h2>
        <p>Future features: drawing tools, shapes, sticky notes, and multiplayer cursors.</p>

        <canvas
          id="whiteboard-canvas"
          width="620"
          height="330"
          style="width:100%; border:1px solid var(--border); border-radius:10px; background:#fff; cursor:crosshair;"
        ></canvas>
      `;

    case "admin":
      return `
        <h2>🛡️ Owner Admin Console</h2>
        <p style="color:var(--muted);">
          Authorized owner controls. All actions should be verified by the server.
        </p>

        <div class="admin-grid">
          <div class="admin-card">
            <h3>👥 Online Users</h3>
            <p>24 connected users</p>
          </div>

          <div class="admin-card">
            <h3>📄 Active Documents</h3>
            <p>17 documents being edited</p>
          </div>

          <div class="admin-card">
            <h3>🌐 Server Status</h3>
            <p style="color:#6ee7a0;">Operational</p>
          </div>

          <div class="admin-card">
            <h3>💾 Storage</h3>
            <p>2.4 GB used</p>
          </div>
        </div>

        <h3>Admin Command Terminal</h3>

        <form id="admin-command-form">
          <div style="display:flex; gap:8px;">
            <input
              id="admin-command-input"
              placeholder="/admin help"
              style="flex:1; padding:12px; color:var(--text); background:rgba(255,255,255,.08); border:1px solid var(--border); border-radius:8px; outline:none;"
            />
            <button class="primary-button">Run</button>
          </div>
        </form>

        <pre
          id="admin-output"
          style="margin-top:15px; padding:15px; min-height:100px; color:#9da8ff; background:#090b11; border-radius:8px; white-space:pre-wrap;"
        >Type /admin help to see available commands.</pre>
      `;

    case "settings":
      return `
        <h2>Settings</h2>
        <div class="admin-card">
          <h3>Appearance</h3>
          <p>Dark glass interface enabled.</p>
        </div>
        <br />
        <div class="admin-card">
          <h3>Notifications</h3>
          <p>Live messages and document activity enabled.</p>
        </div>
      `;

    default:
      return `<div class="placeholder">App not found.</div>`;
  }
}

function createWindow(appId) {
  if (openWindows.has(appId)) {
    focusWindow(openWindows.get(appId).element);
    return;
  }

  const app = appData[appId];
  if (!app) return;

  windowCount++;

  const element = document.createElement("section");
  element.className = "app-window";
  element.dataset.appId = appId;
  element.style.width = `${app.width}px`;
  element.style.height = `${app.height}px`;

  const offset = Math.min(windowCount * 25, 160);

  element.style.left = `${180 + offset}px`;
  element.style.top = `${55 + offset}px`;
  element.style.zIndex = ++zIndex;

  element.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <span>${app.icon}</span>
        <span>${app.title}</span>
      </div>

      <div class="window-controls">
        <button class="minimize" title="Minimize">—</button>
        <button class="maximize" title="Maximize">□</button>
        <button class="close" title="Close">×</button>
      </div>
    </div>

    <div class="window-content">
      ${getAppContent(appId)}
    </div>
  `;

  windowArea.appendChild(element);

  const taskbarButton = document.createElement("button");
  taskbarButton.className = "taskbar-app active";
  taskbarButton.textContent = `${app.icon} ${app.title}`;
  taskbarButton.dataset.appId = appId;
  taskbarApps.appendChild(taskbarButton);

  openWindows.set(appId, {
    element,
    taskbarButton,
    minimized: false
  });

  setupWindow(element, taskbarButton);
  setupAppEvents(appId, element);

  focusWindow(element);
}

function setupWindow(element, taskbarButton) {
  const titlebar = element.querySelector(".window-titlebar");
  const closeButton = element.querySelector(".close");
  const minimizeButton = element.querySelector(".minimize");
  const maximizeButton = element.querySelector(".maximize");

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener("mousedown", (event) => {
    if (event.target.closest(".window-controls")) return;
    if (element.classList.contains("maximized")) return;

    dragging = true;
    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;

    focusWindow(element);
  });

  document.addEventListener("mousemove", (event) => {
    if (!dragging) return;

    element.style.left = `${event.clientX - offsetX}px`;
    element.style.top = `${event.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  titlebar.addEventListener("dblclick", () => {
    element.classList.toggle("maximized");
  });

  closeButton.addEventListener("click", () => {
    const appId = element.dataset.appId;
    element.remove();
    taskbarButton.remove();
    openWindows.delete(appId);
  });

  minimizeButton.addEventListener("click", () => {
    element.classList.add("hidden");
    taskbarButton.classList.remove("active");

    const windowInfo = openWindows.get(element.dataset.appId);
    if (windowInfo) windowInfo.minimized = true;
  });

  maximizeButton.addEventListener("click", () => {
    element.classList.toggle("maximized");
    focusWindow(element);
  });

  taskbarButton.addEventListener("click", () => {
    if (element.classList.contains("hidden")) {
      element.classList.remove("hidden");
      focusWindow(element);
      taskbarButton.classList.add("active");
    } else {
      element.classList.add("hidden");
      taskbarButton.classList.remove("active");
    }
  });

  element.addEventListener("mousedown", () => {
    focusWindow(element);
  });
}

function focusWindow(element) {
  zIndex++;
  element.style.zIndex = zIndex;

  document.querySelectorAll(".taskbar-app").forEach((button) => {
    button.classList.remove("active");
  });

  const appId = element.dataset.appId;
  const info = openWindows.get(appId);

  if (info) {
    info.taskbarButton.classList.add("active");
  }
}

function setupAppEvents(appId, element) {
  if (appId === "chat") {
    const form = element.querySelector("#chat-form");
    const input = element.querySelector("#chat-message-input");
    const messages = element.querySelector("#chat-messages");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const text = input.value.trim();
      if (!text) return;

      const message = document.createElement("div");
      message.className = "message";
      message.innerHTML = `
        <strong>You</strong>
        <small>now</small>
        <div>${escapeHtml(text)}</div>
      `;

      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
      input.value = "";
    });
  }

  if (appId === "editor") {
    const editor = element.querySelector("#editor-area");
    const saveButton = element.querySelector("#save-document");
    const shareButton = element.querySelector("#share-document");

    saveButton.addEventListener("click", () => {
      localStorage.setItem("collab-document", editor.value);
      alert("Document saved locally.");
    });

    shareButton.addEventListener("click", () => {
      alert("Real-time sharing will be connected to the backend later.");
    });

    const savedDocument = localStorage.getItem("collab-document");
    if (savedDocument) {
      editor.value = savedDocument;
    }

    element.querySelectorAll("[data-format]").forEach((button) => {
      button.addEventListener("click", () => {
        alert(`${button.dataset.format} formatting will be connected to the editor engine later.`);
      });
    });
  }

  if (appId === "whiteboard") {
    const canvas = element.querySelector("#whiteboard-canvas");
    const ctx = canvas.getContext("2d");
    let drawing = false;

    canvas.addEventListener("mousedown", (event) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mousemove", (event) => {
      if (!drawing) return;

      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
    });

    canvas.addEventListener("mouseup", () => {
      drawing = false;
    });

    canvas.addEventListener("mouseleave", () => {
      drawing = false;
    });
  }

  if (appId === "admin") {
    const form = element.querySelector("#admin-command-form");
    const input = element.querySelector("#admin-command-input");
    const output = element.querySelector("#admin-output");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const command = input.value.trim();
      output.textContent = runAdminCommand(command);
      input.value = "";
    });
  }
}

function runAdminCommand(command) {
  const parts = command.trim().split(/\s+/);
  const action = parts[1];

  if (!command.startsWith("/admin")) {
    return "Error: Commands must begin with /admin";
  }

  switch (action) {
    case "help":
      return [
        "Available commands:",
        "/admin help",
        "/admin users",
        "/admin server-status",
        "/admin active-documents",
        "/admin announce <message>",
        "/admin lock <document>",
        "/admin maintenance on",
        "/admin maintenance off",
        "/admin view-logs"
      ].join("\n");

    case "users":
      return "24 users online.\n3 moderators.\n1 owner.";

    case "server-status":
      return "Server: operational\nWebSocket: connected\nDatabase: connected\nLatency: 42ms";

    case "active-documents":
      return "17 active documents.\n8 currently being edited.";

    case "announce":
      return `Announcement created: ${parts.slice(2).join(" ") || "(empty message)"}`;

    case "lock":
      return `Document locked: ${parts.slice(2).join(" ") || "unspecified document"}`;

    case "maintenance":
      return `Maintenance mode: ${parts[2] === "on" ? "ENABLED" : "DISABLED"}`;

    case "view-logs":
      return "Recent logs:\n[INFO] User connected\n[INFO] Document updated\n[INFO] Chat message received";

    default:
      return "Unknown command. Type /admin help.";
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.querySelectorAll("[data-app]").forEach((button) => {
  button.addEventListener("click", () => {
    createWindow(button.dataset.app);
    startMenu.classList.add("hidden");
  });
});

startButton.addEventListener("click", () => {
  startMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  if (
    !event.target.closest("#start-menu") &&
    !event.target.closest("#start-button")
  ) {
    startMenu.classList.add("hidden");
  }
});

document.getElementById("app-search").addEventListener("input", (event) => {
  const search = event.target.value.toLowerCase();

  document.querySelectorAll(".start-apps button").forEach((button) => {
    button.style.display = button.textContent.toLowerCase().includes(search)
      ? "block"
      : "none";
  });
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest(".app-window") || event.target.closest(".taskbar")) {
    return;
  }

  event.preventDefault();

  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.top = `${event.clientY}px`;
  contextMenu.classList.remove("hidden");
});

document.addEventListener("click", () => {
  contextMenu.classList.add("hidden");
});

document.getElementById("refresh-desktop").addEventListener("click", () => {
  location.reload();
});

document.getElementById("change-wallpaper").addEventListener("click", () => {
  document.getElementById("desktop").style.background =
    "linear-gradient(135deg, #20153d, #102b3d, #111522)";
});

document.getElementById("open-admin-context").addEventListener("click", () => {
  createWindow("admin");
});
