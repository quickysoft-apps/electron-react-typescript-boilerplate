import { ipcRenderer } from 'electron';
import * as uuid from 'uuid';
import { actionCreator, actionCreatorVoid } from './helpers';

class Ipc {

  private _listeners: Map<string, Function> = new Map<string, Function>();
  private _ipc: Electron.IpcRenderer;

  constructor(ipc: Electron.IpcRenderer) {
    this._ipc = ipc;
  }

  addListener(event: string, listener: Function): void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, listener);
      this._ipc.on(event, listener)
    }
  }

  clearListeners(): void {
    this._listeners.forEach((value, key) => {
      this._ipc.removeListener(key, value);
    });
    this._listeners.clear();
  }

  send(channel: string, ...args: any[]): void {
    this._ipc.send(channel, args[0]);
  }

}

const ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  result?: any;
  error?: Object;
}

export interface Job {
  jobId?: string;  
  cron?: any;
  script: string;
  input: any;
}

export const notifyStarted = actionCreator<IpcEventArg>('jobRunner/NOTIFY_STARTED');
export const notifyResult = actionCreator<IpcEventArg>('jobRunner/NOTIFY_RESULT');
export const notifyError = actionCreator<IpcEventArg>('jobRunner/NOTIFY_ERROR');
export const notifyCompleted = actionCreator<IpcEventArg>('jobRunner/NOTIFY_COMPLETED');
export const notifyStopped = actionCreator<IpcEventArg>('jobRunner/NOTIFY_STOPPED');
export const stop = actionCreatorVoid('jobRunner/STOP');

export const executeAsync = function (job: Job) {
  return (dispatch: Function) => {

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

    const arg = {
      jobId: uuid.v4(),
      cron: job.cron,
      script: job.script,
      input: job.input 
    }
    ipc.send('ipc/JOB_START', arg);

  }

}

