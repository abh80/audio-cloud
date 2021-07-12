const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
let isDev = require("electron-is-dev");
const url = require("url");
const { Store } = require("./store");
const { Client } = require("discord-rpc");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const rpcClient = new Client({ transport: "ipc" });

if (require("electron-squirrel-startup")) {
  app.quit();
}
const store = new Store();
const createWindow = (registerIpc) => {
  const lastSize = store.lastWindowSize();
  const mainWindow = new BrowserWindow({
    x: lastSize.x,
    y: lastSize.y,
    width: lastSize.width,
    height: lastSize.height,
    show: false,
    minWidth: 800,
    height: 600,
    resizable: true,
    icon: path.join(__dirname, "..", "icons", "soundcloud.ico"),
    frame: false,
    transparent: true,
    webPreferences: {
      devTools: isDev ? true : true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.on("resized", () => {
    var size = mainWindow.getSize();
    var post = mainWindow.getPosition();
    store.setWindowSize({
      width: size[0],
      height: size[1],
      x: post[0],
      y: post[1],
    });
  });
  mainWindow.on("moved", () => {
    var size = mainWindow.getSize();
    var post = mainWindow.getPosition();
    store.setWindowSize({
      width: size[0],
      height: size[1],
      x: post[0],
      y: post[1],
    });
  });
  mainWindow.on("maximize", () => {
    store.setMaximized(true);
  });
  mainWindow.on("unmaximize", () => {
    store.setMaximized(false);
  });
  if (registerIpc !== false) registerIpcMainHandlers(mainWindow);
  lastSize.maximized ? mainWindow.maximize() : null;
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3800"
      : url.format({
          protocol: "file",
          slashes: true,
          pathname: path.join(__dirname, "..", "react-build", "index.html"),
        })
  );
};

app.on("ready", () => createWindow(true));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (process.platform == "darwin") {
      createWindow(false);
    }
    createWindow();
  }
});
ipcMain.handle("set-rpc", (e, { name, artist, time = new Date() }) => {
  rpcClient
    .setActivity({
      details: `Listening ${name}`,
      state: `by ${artist}`,
      largeImageKey: "soundcloud",
      largeImageText: "Listening on Audio Cloud",
      startTimestamp: parseInt((time / 1000).toFixed(0)),
    })
    .catch();
});
ipcMain.handle("remove-rpc", () => {
  rpcClient.clearActivity().catch();
});
/**
 *
 * @param {BrowserWindow} mainWindow
 */
const registerIpcMainHandlers = (mainWindow) => {
  ipcMain.handle("close-pressed", () => {
    mainWindow.close();
  });
  ipcMain.handle("min-pressed", () => {
    mainWindow.minimize();
  });
  ipcMain.handle("res-max-pressed", () => {
    if (process.platform == "darwin" && mainWindow.isFullScreen()) {
      const lastSize = store.lastWindowSize();
      mainWindow.setSize(lastSize.width, lastSize.height, true);
      mainWindow.setPosition(
        lastSize.x ? lastSize.x : 0,
        lastSize.y ? lastSize.y : 0
      );
    } else if (mainWindow.isMaximized()) {
      const lastSize = store.lastWindowSize();
      mainWindow.setSize(lastSize.width, lastSize.height, true);
      mainWindow.setPosition(
        lastSize.x ? lastSize.x : 0,
        lastSize.y ? lastSize.y : 0
      );
      store.setMaximized(false);
    } else {
      if (process.platform == "darwin") mainWindow.setFullScreen(true);
      else mainWindow.maximize();
      store.setMaximized(true);
    }
  });
};
rpcClient.login({ clientId: "862943897902907392" }).catch();
