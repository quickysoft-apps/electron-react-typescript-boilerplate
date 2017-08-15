const ipcRenderer = require('electron').ipcRenderer;
const edge = require('edge');
const CronJob = require('cron').CronJob;
const jobs = new Map();

const startJob = function (arg, callback, onComplete) {
  const func = edge.func(arg.script);
  const id = arg.id;
  let cron = arg.cron;
  try {
    if (!cron) {
      try {
        callback(id, func(arg.script, true));
        onComplete();
      } catch (error) {
        callback(id, null, error);
      }
    }
    const job = new CronJob(cron, () => {
      try {
        callback(id, func(arg.script, true));
      } catch (error) {
        callback(id, null, error);
      }
    }, onComplete, true, 'Europe/Paris');
    jobs.set(id, job);
    return id;
  } catch (error) {
    callback(id, null, error);
  }
}

const stopJob = function (id) {
  const job = jobs.get(id);
  if (job) {
    job.stop();
  }
  jobs.delete(id);
}

window.onload = function () {
  ipcRenderer.on('scriptRunner/START', (event, arg) => {
    const id = startJob(arg, (id, result, error) => {
      if (error) {
        event.sender.send('scriptRunner/ERROR', { id, error })
      } else {
        event.sender.send('scriptRunner/RESULT', { id, result })
      }
    }, () => {
      event.sender.send('scriptRunner/COMPLETED', { id, result })
    })
    event.sender.send('scriptRunner/STARTED', { id });
  })

  ipcRenderer.on('scriptRunner/STOP', (event, arg) => {
    stopJob(arg.id);
    event.sender.send('scriptRunner/STOPPED', { id: arg.id })
  });
}
