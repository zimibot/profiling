const { app, BrowserWindow, dialog } = require('electron');
const window = require("./createWindow");
const action = require('../action/_action')
const path = require("path")
const url = require("url")
const fungsiPictureInPicture = require('./windows/fungsiPictureInPicture')
const {
  config: { development, ip, windows: { quit },
    window: { config, webPreferences },

  },
} = require('../helper/_config');

const changeTheme = require('./windows/changeTheme');
const download = require('./update/download');
// const singleInstanceLock = app.requestSingleInstanceLock();




async function createWindow() {


  download().then(d => {
    if (d === "next" || d === "update nothing") {
      let win = window(config, webPreferences)

      if (development) {
        win.loadURL(ip);
        win.webContents.openDevTools({ mode: 'detach' });
      } else {
        // errorDialog(path.join(__dirname, "../index.html"))
        win.loadURL(url.format({
          pathname: path.join(__dirname, "../index.html"),
          hash: "/",
          protocol: 'file:',
          slashes: true,
        }))
        // win.webContents.openDevTools({ mode: 'detach' });


        win.webContents.executeJavaScript(`
          localStorage.setItem("mode", "dark")
          localStorage.removeItem("token")
        `)

      }


      win.maximize()
      win.on("close", () => {
        app.quit()
      })

    }
  }).catch((d) => {
    const dialogOpts = {
      type: 'error',
      buttons: ['Ok'],
      title: 'Update ERROR',
      message: "Error",
      detail: "ERROR"
    };

    dialog.showMessageBox(dialogOpts);
    // errorMsg({ window: WindowMain })
    // WindowMain()
  })


}

fungsiPictureInPicture()
changeTheme()


app.whenReady().then(createWindow);

app.on('browser-window-created', (event, window) => {
  // Attach an event listener to the window's webContents
  window.webContents.on('before-input-event', (event, input) => {
    // Check if the event is a keydown event and if the Control key is pressed
    if (input.type === 'keyDown' && input.control) {
      // Zoom in when Control and + (equals) are pressed
      if (input.key === '=') {
        window.webContents.setZoomLevel(window.webContents.getZoomLevel() + 1);
        event.preventDefault();
      }
      // Zoom out when Control and - (minus) are pressed
      else if (input.key === '-') {
        console.log(window.webContents.getZoomLevel() - 1)
        window.webContents.setZoomLevel(window.webContents.getZoomLevel() - 1);
        event.preventDefault();
      }
      // Reset zoom to 100% when Control and 0 (zero) are pressed
      else if (input.key === '0') {
        window.webContents.setZoomLevel(0);
        event.preventDefault();
      }
    }
  });
});


// if (!singleInstanceLock) {
//   app.quit()
// } else {
//   app.on('second-instance', () => {

//     app.focus();

//     // Code to open up second window goes here.
//   });
// }


app.on('window-all-closed', () => {
  quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    action()
  }
});