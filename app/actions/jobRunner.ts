import { actionCreator, actionCreatorVoid } from './helpers';

import { Ipc } from '../api/ipc';
import { ipcRenderer } from 'electron';
const ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  result?: any;
  error?: Object;  
}

export interface Job {
  jobId: string;  
  cron?: any;
  script: string;
  input: any;
  title?: string;
}

export const notifyStarted = actionCreator<IpcEventArg>('jobRunner/NOTIFY_STARTED');
export const notifyResult = actionCreator<IpcEventArg>('jobRunner/NOTIFY_RESULT');
export const notifyError = actionCreator<IpcEventArg>('jobRunner/NOTIFY_ERROR');
export const notifyCompleted = actionCreator<IpcEventArg>('jobRunner/NOTIFY_COMPLETED');
export const notifyStopped = actionCreator<IpcEventArg>('jobRunner/NOTIFY_STOPPED');
export const stop = actionCreatorVoid('jobRunner/STOP');

export const executeAsync = function (job: Job) {
  return (dispatch: Function, getState: Function) => {

    ipc.addListener('ipc/JOB_RESULT', (event: any, arg: any) => {
      dispatch(notifyResult(arg));
    });

    ipc.addListener('ipc/JOB_ERROR', (event: any, arg: any) => {      
      dispatch(notifyError(arg));
    });

    ipc.addListener('ipc/JOB_STARTED', (event: any, arg: any) => {
      dispatch(notifyStarted(arg));
    });

    ipc.addListener('ipc/JOB_COMPLETED', (event: any, arg: any) => {
      dispatch(notifyCompleted(arg));
    });

    ipc.addListener('ipc/JOB_STOPPED', (event: any, arg: any) => {
      ipc.clearListeners();
      dispatch(notifyStopped(arg));
    });

    const jobId = getState().jobRunner.jobId;

    const arg = {
      jobId,
      cron: job.cron,
      script: job.script,
      input: job.input 
    }
    ipc.send('ipc/JOB_START', arg);

  }

}

