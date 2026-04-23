const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("arenaxDesktop", {
  platform: process.platform
});

