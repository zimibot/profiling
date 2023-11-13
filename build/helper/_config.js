const { app } = require('electron');
const isDev = require('electron-is-dev');
const url = require('url');


module.exports = {
  config: {
    ip: "http://localhost:5173",
    development: isDev,
    mac_os: {
      status: process.platform !== 'darwin'
    },
    windows: {
      status: process.platform === 'darwin',
      quit: () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      }
    },
    build: {
      pathname: "/index.html",
    },
    window: {
      config: {

      },
      webPreferences: {

      }
    },

    url_path: ({ hash = "/", pathname }) => {
      url.format(
        {
          pathname: path.join(__dirname, pathname),
          hash,
          slashes: true
        });
    }

  }
}