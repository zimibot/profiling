const {
  contextBridge,
  ipcRenderer
} = require("electron");


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const api = {
  PictureInPictureEvent: ["pip", "pip_close", "pip_maximize", "pip_minimize"],
  changeTheme: ["change_theme", "new_browser"]
}


contextBridge.exposeInMainWorld("api", {
  invoke: (channel, data) => {
    let validChannels = [...api.PictureInPictureEvent, ...api.changeTheme]; // list of ipcMain.handle channels you want access in frontend to
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
}
);
