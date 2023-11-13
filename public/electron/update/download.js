
const { dialog } = require("electron");
const { version } = require("../../../package.json")
const axios = require("axios")
const update = require("./index")




module.exports = async function DownloadFIles() {
    return new Promise(async function (resolve, reject) {
        // do stuff
        if (true) {
            try {
                let get = await axios({
                    method: 'get',
                    url: `https://aray.ma/wp-content/uploads/update/log_install_profiling.json`,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });


                if (get.data.newVersion !== version) {
                    let msg = await errorMsg({ msg: "The latest update is available", btnMsg: "Run Profiling" })

                    if (msg === 0) {

                        update(get.data.newVersion)
                        resolve("update")
                    } else {
                        if (msg === 1) {
                            resolve("next")
                        }
                    }
                } else {
                    resolve("update nothing")
                }

            } catch (error) {
                reject(error)
            }
        }
    });


}


const errorMsg = ({ msg, btnMsg }) => {
    let response = dialog.showMessageBoxSync({
        type: "info",
        buttons: ['Update', btnMsg ? btnMsg : 'Run EL WAGYL'],
        title: `INFORMATION`,
        message: msg
    });

    return response
    // if (element) {
    //     if (response == 0) element.close();
    // } else {
    //     if (response == 0) app.quit();
    // }

}