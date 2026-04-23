const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, shell } = require("electron");

const devServerUrl = process.env.ARENAX_DESKTOP_URL || "http://127.0.0.1:19006";

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1180,
    minHeight: 760,
    backgroundColor: "#08101d",
    title: "ArenaX",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  if (!app.isPackaged) {
    void window.loadURL(devServerUrl);
    return;
  }

  const rendererPath = path.join(__dirname, "renderer", "index.html");
  if (fs.existsSync(rendererPath)) {
    void window.loadFile(rendererPath);
    return;
  }

  const fallbackHtml = `
    <html>
      <body style="margin:0;padding:32px;background:#08101d;color:#f6fbff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <h1 style="margin-top:0;">ArenaX desktop shell</h1>
        <p>No packaged web renderer was found.</p>
        <p>Run <code>npm run dev:desktop</code> from the repo root during development.</p>
      </body>
    </html>
  `;

  void window.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(fallbackHtml)}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

