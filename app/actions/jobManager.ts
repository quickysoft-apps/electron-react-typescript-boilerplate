import { actionCreator } from './helpers';
import settings = require('electron-settings');
import { Job } from './jobRunner';
//import { BrowserWindow } from 'electron';
import { ipcRenderer } from 'electron';
import { Ipc } from '../api/ipc';
const ipc = new Ipc(ipcRenderer);

/*interface JsonObject {
  [x: string]: JsonObject | null;
}*/

// interface JobWindow extends Electron.BrowserWindow {
//   job: Job;
// }


export const add = actionCreator<Job>('jobManager/ADD');
export const open = actionCreator<string>('jobManager/OPEN');

export const syncAsync = function () {
  return (dispatch: Function, getState: Function) => {

    //running job windows
    /*BrowserWindow.getAllWindows().forEach((window: JobWindow) => {
      const job = {
        ...window.job,
        running: true
      }
      addJobToSettings(job);
      dispatch(add(job));
    });*/

    //settings
    const jobs: any = settings.get('jobs');
    Object.keys(jobs).forEach(key => {
      if (jobs[key]) {
        const job = JSON.parse(jobs[key]);
        dispatch(add(job));
        if (job.running) {
          const arg = {
            jobId: job.jobId,
            cron: job.cron,
            script: job.script,
            input: job.input 
          }
          ipc.send('ipc/JOB_START', arg);
        }
        
      }
      
    });
    

    

  }

}