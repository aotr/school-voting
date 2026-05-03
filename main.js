const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const isDev = process.env.ELECTRON_DEV === "true" || process.argv.includes("--dev");

let mainWindow;
let adminWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "index.html")}`;

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createAdminWindow() {
  if (adminWindow) {
    adminWindow.focus();
    return;
  }

  adminWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  adminWindow.loadFile(path.join(__dirname, "admin.html"));

  if (isDev) {
    adminWindow.webContents.openDevTools();
  }

  adminWindow.on("closed", () => {
    adminWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  createMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Menu
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open Admin Panel",
          accelerator: "CmdOrCtrl+Shift+A",
          click: createAdminWindow,
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers for database operations
ipcMain.handle("db:get-voting-state", async () => {
  try {
    const db = require("./database/db");
    return db.getVotingState();
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
});

ipcMain.handle("db:record-vote", async (event, candidateId) => {
  try {
    const db = require("./database/db");
    return db.recordVote(candidateId);
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
});

ipcMain.handle("db:reset-votes", async () => {
  try {
    const db = require("./database/db");
    return db.resetVotes();
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
});

ipcMain.handle("db:admin-query", async (event, query, params) => {
  try {
    const db = require("./database/db");
    return db.adminQuery(query, params);
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
});

ipcMain.handle("db:get-results", async () => {
  try {
    const db = require("./database/db");
    return db.getResults();
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
});
