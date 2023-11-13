const { ipcMain, nativeTheme, shell } = require("electron");


module.exports = () => {
    nativeTheme.themeSource = 'dark'
    ipcMain.handle('change_theme', async (t, e) => {
        return new Promise(function () {
            // do stuff
            if (true) {
                console.log(e)
                if (e === "light") {
                    nativeTheme.themeSource = 'light'
                } else {
                    nativeTheme.themeSource = 'dark'
                }

                return nativeTheme.shouldUseDarkColors
            }
        });
    });
    ipcMain.handle('new_browser', async (_, url) => {
        return new Promise(function () {
            // do stuff
            if (true) {
                shell.openExternal(url);

            }
        });
    });

}


// window.api.invoke('routesItem', {
//     size: {
//         y: height,
//         width: 0,
//         height: 0
//     },
//     attribute: document.body.getAttribute("name"),
// })