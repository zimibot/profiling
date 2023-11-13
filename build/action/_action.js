const {  ipcMain } = require('electron');


module.exports = () => {
    ipcMain.handle('dirname', async (event, arg) => {
        return new Promise(function (resolve, reject) {
            // do stuff
           
        });
    });
}