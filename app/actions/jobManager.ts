import { actionCreator } from './helpers';
import settings = require('electron-settings');
import { JobDefinition } from './jobRunner';
import { ipcRenderer } from 'electron';
import { Ipc } from '../api/ipc';
const ipc = new Ipc(ipcRenderer);

export interface JobStatus {
  jobDefinition: JobDefinition;
  isRunning: boolean;
}

export const add = actionCreator<JobDefinition>('jobManager/ADD');
export const select = actionCreator<JobStatus>('jobManager/SELECT');

export const load = function () {
  return (dispatch: Function, getState: Function) => {

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