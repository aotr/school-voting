const { app, BrowserWindow, Menu } = require("electron");
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
    icon: path.join(__dirname, "assets", "app-icon.png"),
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

  // Always load from file - no dev server is running
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
    icon: path.join(__dirname, "assets", "app-icon.png"),
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
  // Set dock icon on macOS
  if (process.platform === "darwin") {
    try {
      app.dock.setIcon(path.join(__dirname, "assets", "app-icon.png"));
    } catch (err) {
      // Icon file may not exist yet, continue anyway
      console.log("Note: App icon not found at assets/app-icon.png");
    }
  }
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

// Menu - Minimal menu with only Admin Panel option
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
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
