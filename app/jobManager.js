
const { BrowserWindow, ipcMain } = require('electron');

const jobs = [];

const findJob = function (jobId) {
  return jobs.find(x => { return x.jobId === jobId })
}

const addJob = function (jobId, window) {
  const job = findJob(jobId);
  if (!job) {
    jobs.push({ jobId, window });
  }
}

const removeJob = function (jobId) {
  const job = findJob(jobId);
  if (job && job.window) {
    job.window.close();
  }
  const index = jobs.findIndex(x => { return x.jobId === jobId });
  if (index > -1) {
    jobs.splice(index, 1);
  }
}

const createJobWindow = function () {
  const jobWindow = new BrowserWindow({ show: false });
  jobWindow.loadURL(`file://${__dirname}/job.html`);
  if (process.env.NODE_ENV === 'development') {
    //jobWindow.openDevTools();
  }
  return jobWindow
}

exports.initialize = function () {

  let mainWebContents = null;

  ipcMain.on('ipc/JOB_START', (event, arg) => {
    mainWebContents = event.sender;
    const bw = createJobWindow();
    bw.on('ready-to-show', () => {
      addJob(arg.jobId, bw);
      bw.webContents.send('ipc/JOB_START', arg);
    })
  });

  ipcMain.on('ipc/JOB_STOP', (event, arg) => {
    const job = findJob(arg.jobId);
    if (job && job.window) {
      job.window.webContents.send('ipc/JOB_STOP', arg);
    }
  });

  ipcMain.on('ipc/JOB_STARTED', (event, arg) => {
    if (!mainWebContents) return;
    mainWebContents.send('ipc/JOB_STARTED', arg);
  });

  ipcMain.on('ipc/JOB_RESULT', (event, arg) => {
    if (!mainWebContents) return;
    mainWebContents.send('ipc/JOB_RESULT', arg);
  });

  ipcMain.on('ipc/JOB_ERROR', (event, arg) => {
    removeJob(arg.jobId);
    if (!mainWebContents) return;
    mainWebContents.send('ipc/JOB_ERROR', arg);
    mainWebContents.send('ipc/JOB_STOPPED', arg);
  });

  ipcMain.on('ipc/JOB_STOPPED', (event, arg) => {
    removeJob(arg.jobId);
    if (!mainWebContents) return;
    mainWebContents.send('ipc/JOB_STOPPED', arg);
  });

  ipcMain.on('ipc/JOB_COMPLETED', (event, arg) => {
    removeJob(arg.jobId);
    if (!mainWebContents) return;
    mainWebContents.send('ipc/JOB_COMPLETED', arg);
  });

}