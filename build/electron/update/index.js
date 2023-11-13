const { app, dialog } = require('electron')
const { NsisUpdater } = require("electron-updater")
const ProgressBar = require('electron-progressbar');
const log = require("electron-log")
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});

const update = (txt) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Update Available',
        message: "",
        detail: txt
    };
    dialog.showMessageBox(dialogOpts);
}

function formatBytes(bytes, decimals = 0, binaryUnits = true) {
    return format(
        bytes,
        binaryUnits ? 1024 : 1000,
        binaryUnits ?
            ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] :
            ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    )

    function format(value, divisor, [currentLabel, ...otherLabels]) {
        if (value < divisor) return `${value.toFixed(decimals || 0)} ${currentLabel}`;

        return format(value / divisor, divisor, otherLabels);
    }
}

module.exports = async (newVersion) => {

    try {
        let progressBar;

        const updateSr = new NsisUpdater({
            provider: "generic",
            url: `https://aray.ma/wp-content/uploads/update/profiling/${newVersion}`,
            channel: 'latest',
        })


        updateSr.logger = log
        updateSr.logger.transports.file.level = "info"
        updateSr.autoDownload = true;


        setTimeout(() => {
            updateSr.checkForUpdates().then(resp => {
                log.info("autoUpdate response:");
                log.info(resp);
            })

            updateSr.on("update-cancelled", () => {
                update("update-cancelled")
            })

            updateSr.on("update-not-available", () => {
                update("update-not-available")
            })


            updateSr.on("checking-for-update", () => {
                update("checking-for-update")
            })


            updateSr.on("update-available", () => {
                progressBar = new ProgressBar({
                    indeterminate: false,
                    text: 'Preparing data...',
                    detail: 'Wait...'
                });
            })
            
            updateSr.on('update-downloaded', (_event, releaseNotes, _releaseName) => {
                log.info("update downloaded");
                progressBar.detail = `Download Update Success`;
                progressBar.text = 'Waiting Installer new update app...'
                updateSr.quitAndInstall()
                progressBar.value = 100
                
            });
            
            updateSr.on("download-progress", (progressObj) => {

                let log_message = "Download speed: " + formatBytes(progressObj.bytesPerSecond, 2, true);
                log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
                log_message = log_message + ' (' + formatBytes(progressObj.transferred, 2, true) + "/" + formatBytes(progressObj.total, 0, true) + ')';
                progressBar.text = "Download Progress"
                progressBar.detail = log_message
                progressBar.value = parseInt(progressObj.percent);
            })



            updateSr.on("error", (d) => {
                app.quit()
                update(d)
            })
        }, 1000);
    } catch (error) {
        update(error)
        app.quit()
    }

}