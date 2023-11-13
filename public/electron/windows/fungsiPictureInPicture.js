const { screen, ipcMain } = require("electron");
const { config: { development, ip } } = require("../../helper/_config")
const window = require("../createWindow");

let appWIn
let w = 500, h = 400

module.exports = () => {
    ipcMain.handle('pip', async () => {
        return new Promise(function () {
            // do stuff
            if (true) {
                if (appWIn) {
                    appWIn.win.close()
                    appWIn = null
                }
                window_fn()
            }
        });
    });
    ipcMain.handle('pip_close', async () => {
        return new Promise(function () {
            // do stuff
            if (true) {
                appWIn.win.close()
                appWIn = null
            }
        });
    });
    ipcMain.handle('pip_maximize', async () => {
        return new Promise(function () {
            // do stuff
            if (true) {
                let display = screen.getPrimaryDisplay();

                let height = display.bounds.height;
                appWIn.win.setSize(1200, height)
                appWIn.win.center()
            }
        });
    });
    ipcMain.handle('pip_minimize', async () => {
        return new Promise(function () {
            // do stuff
            if (true) {
                let display = screen.getPrimaryDisplay();
                let width = display.bounds.width;
                let height = display.bounds.height;
                appWIn.win.setSize(w, h)
                appWIn.win.setPosition(width - (w + 10), height - (h + 60))
            }
        });
    });

}

const window_fn = async () => {
    if (!appWIn) {
        let display = screen.getPrimaryDisplay();
        let width = display.bounds.width;
        let height = display.bounds.height;
        const config = {
            focusable: true,
            frame: false,
            height: h,
            width: w,
            minWidth: w,
            minHeight: h,
            maxHeight: height,
            maxWidth: 1200,
            // resizable: false,
            x: width - (w + 10),
            y: height - (h + 60),
            fullscreen: false,
            transparent: true,
        }
        appWIn = await window(config)
        let { webContents } = appWIn.win
        appWIn.win.focus()
        appWIn.win.removeMenu()
        appWIn.win.setAlwaysOnTop(true, "floating")
        webContents.openDevTools({ mode: 'detach' });
        if (development) {
            appWIn.win.loadURL(`${ip}/#/other/pip`)
        }
    }



}


// window.api.invoke('routesItem', {
//     size: {
//         y: height,
//         width: 0,
//         height: 0
//     },
//     attribute: document.body.getAttribute("name"),
// })