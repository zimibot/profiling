const { dialog: { showMessageBox }, app:{quit} } = require("electron")

module.exports = {
    errorDialog: (msg) => {
        showMessageBox({
            type: "error",
            buttons: ["OK"],
            detail: `${msg}`
        }).then(d => {
            if (d === 0) {
                quit()
            }
        })
    }
}