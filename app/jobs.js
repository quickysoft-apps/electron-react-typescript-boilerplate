const ipcRenderer = require('electron').ipcRenderer;
const edge = require('edge');
const CronJob = require('cron').CronJob;
const jobs = new Map();

const startJob = function (arg, callback, onCompleted) {
  const func = edge.func(arg.code);
  const jobId = arg.jobId;
  let cron = arg.cron;
  try {
    if (!cron) {

      try {
        callback(jobId, func(arg.code, true));
        onCompleted();
      } catch (error) {
        callback(jobId, null, error);
      }
    }
    const job = new CronJob(cron, () => {
      try {
        callback(jobId, func(arg.code, true));
      } catch (error) {
        callback(jobId, null, error);
      }
    }, onCompleted, true, 'Europe/Paris');
    jobs.set(jobId, job);
    return jobId;
  } catch (error) {
    callback(jobId, null, error);
  }
}

const stopJob = function (jobId) {
  const job = jobs.get(jobId);
  if (job) {
    job.stop();
  }
  jobs.delete(jobId);
}

window.onload = function () {
  ipcRenderer.on('job/START', (event, arg) => {
    const jobId = startJob(arg, (jobId, result, error) => {
      if (error) {
        event.sender.send('job/ERROR', { jobId, error })
      } else {
        event.sender.send('job/RESULT', { jobId, result })
      }
    }, () => { event.sender.send('job/COMPLETED', { jobId, result }) })
    event.sender.send('job/STARTED', { jobId });
  })

  ipcRenderer.on('job/STOP', (event, arg) => {
    stopJob(arg.jobId);
    event.sender.send('job/STOPPED', { jobId: arg.jobId })
  });
}
