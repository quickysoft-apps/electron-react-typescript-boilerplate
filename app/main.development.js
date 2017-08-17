const { Tray, app, BrowserWindow, Menu, shell, dialog, ipcMain, webContents } = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
const log = require('electron-log');
const os = require('os');
const pjson = require('./package.json');

let menu;
let template;
let mainWindow = null;
let trayIcon = null;
let mustQuit = false;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

const showMainWindow = () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    checkUpdates();
  }
}

const initializeTrayIcon = () => {
  const path = require('path'); // eslint-disable-line
  const iconPath = path.join(__dirname, '..', 'resources', 'icons', 'ykp-simple-logo32.png');

  const template = [
    {
      label: 'Afficher Yakapa Supervisor',
      click: function () {
        showMainWindow();
      }
    },
    {
      label: "Quitter Yakapa Supervisor",
      accelerator: "CmdOrCtrl+Q",
      click() {
        mustQuit = true;
        app.quit();
      }
    }];

  const appIcon = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate(template);
  appIcon.setToolTip(`Yakapa Supervisor ${pjson.version}`);
  appIcon.setContextMenu(contextMenu);
  appIcon.on('double-click', () => {
    showMainWindow();
  })

  return appIcon;
}

const initializeExtensions = () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)));
  }

  return Promise.resolve([]);
};

const checkUpdates = () => {

  if (process.env.NODE_ENV === 'development') {
    return
  }

  const platform = os.platform()
  if (platform === "linux") {
    return
  }

  log.transports.file.level = "info"
  autoUpdater.logger = log

  autoUpdater.addListener('update-downloaded', versionInfo => {
    log.info('New update downloaded : ', versionInfo)

    const dialogOptions = {
      type: "question",
      defaultId: 0,
      message: `The update is ready to install, Version ${versionInfo.version} has been downloaded and will be automatically installed when you click OK`
    }

    let focusedWindow = BrowserWindow.getFocusedWindow()
    dialog.showMessageBox(focusedWindow, dialogOptions, function () {
      setImmediate(() => {
        app.removeAllListeners("window-all-closed")
        if (focusedWindow != null) {
          focusedWindow.close()
        }
        autoUpdater.quitAndInstall(false)
      })
    })
  })

  autoUpdater.checkForUpdates()
}

const initializeMainWindow = () => {

  mainWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: 568,
    resizable: false,
    frame: false,
    fullscreenable: false,
    alwaysOnTop: false
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!trayIcon) {
      trayIcon = initializeTrayIcon();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (event) => {
    if (!mustQuit) {
      event.preventDefault();
      mainWindow.hide();
    } else {
      app.quit();
    }
  })

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }
}

const initializeJobWindow = () => {
  const jobWindow = new BrowserWindow({ show: false });
  jobWindow.loadURL(`file://${__dirname}/jobs.html`);
  if (process.env.NODE_ENV === 'development') {
    jobWindow.openDevTools();
  }
  return jobWindow.id
}

app.on('ready', () =>
  initializeExtensions()
    .then(() => {
      initializeMainWindow();      
    })
);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (url === 'https://mprj.cloudapp.net') {
    // Verification logic.
    event.preventDefault()
    callback(true)
  } else {
    callback(false)
  }
})

ipcMain.on('job/START', (event, arg) => {
  const jobId = initializeJobWindow();
  const bw = BrowserWindow.fromId(jobId);    
  arg.jobId = jobId;
  bw.on('ready-to-show', () => {
    bw.webContents.send('job/START', arg);
    mainWindow.webContents.send('job/STARTED', { jobId });  
  })  
});

ipcMain.on('job/STOP', (event, arg) => {
  const bw = BrowserWindow.fromId(arg.jobId);
  bw.close();
  bw.on('close', () => {
    bw.webContents.send('job/STOP', arg)
    mainWindow.webContents.send('scriptRunner/STOPPED', {jobId: arg.jobId })
  })  
});

ipcMain.on('job/STARTED', (event, arg) => {
  mainWindow.webContents.send('job/STARTED', arg);
});

ipcMain.on('job/RESULT', (event, arg) => {
  mainWindow.webContents.send('job/RESULT', arg);
});

ipcMain.on('job/ERROR', (event, arg) => {
  mainWindow.webContents.send('job/ERROR', arg);
});

ipcMain.on('job/STOPPED', (event, arg) => {
  mainWindow.webContents.send('job/STOPPED', arg);
});

ipcMain.on('job/COMPLETED', (event, arg) => {
  const bw = BrowserWindow.fromId(arg.jobId);
  bw.close();
  bw.on('close', () => {    
    mainWindow.webContents.send('job/COMPLETED', arg);
  })    
});


