
const { BrowserWindow } = require('electron');
const path = require('path');

module.exports = (config, webPreferences) => {

    const { screen } = require('electron')

    // Create a window that fills the screen's available work area.
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width } = primaryDisplay.workAreaSize


    const win = new BrowserWindow({
        focusable: true,
        center: true,
        frame: true,
        minWidth: 850,
        minHeight: 500,
        backgroundColor: "#0D0D0D",
        // transparent: true,

        webPreferences: {
            zoomFactor: width > 1440 && width <= 1707 ? -1 : width > 1280 && width <= 1440 ? -1.3 : width > 1024 && width <= 1280 ? 1.8 : width > 800 && width <= 1024 ? -3 : 0,
            preload: path.join(__dirname, "./preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true,
            ...webPreferences
        },
        ...config
    });

    const zoomFactor = () => {
        if (width > 1440 && width <= 1800) {
            win.webContents.setZoomLevel(-1.1);
        } else if (width > 1280 && width <= 1440) {
            win.webContents.setZoomLevel(-1.5);
        } else if (width > 1024 && width <= 1280) {
            win.webContents.setZoomLevel(-2);
        } else if (width > 800 && width <= 1024) {
            win.webContents.setZoomLevel(-3.2);
        }
    }
    win.webContents.on("did-finish-load", () => {
        if (win.isMaximized()) {
            zoomFactor()
        } else {
            zoomFactor()
        }

    })


    win.removeMenu()


    return win
}


