import * as uuid from 'uuid';
import { ipcRenderer } from 'electron';
import { actionCreator } from './helpers';

export interface ScriptRunnerItem {
  id: string;
  jobId?: string;
  cron?: any;
  code: string;
  input: any;
  result?: Object;
  error?: Object;
  running: boolean;
  jobListeners: Map<string, Function>;
}

export const notifyStarted = actionCreator<ScriptRunnerItem>('scriptRunner/NOTIFY_STARTED');
export const notifyResult = actionCreator<ScriptRunnerItem>('scriptRunner/NOTIFY_RESULT');
export const notifyError = actionCreator<ScriptRunnerItem>('scriptRunner/NOTIFY_ERROR');
export const notifyCompleted = actionCreator<ScriptRunnerItem>('scriptRunner/NOTIFY_COMPLETED');
export const notifyStopped = actionCreator<ScriptRunnerItem>('scriptRunner/NOTIFY_STOPPED');
export const stop = actionCreator<ScriptRunnerItem>('scriptRunner/STOP_CURRENT');

declare type JobListeners = Map<string, Function>;

const JOB_RESULT = 'job/RESULT'
const JOB_ERROR = 'job/ERROR'
const JOB_STARTED = 'job/STARTED'
const JOB_COMPLETED = 'job/COMPLETED'
const JOB_STOPPED = 'job/STOPPED'

function addIpcRendererListener(listeners: JobListeners, event: string, listener: Function) {
  if (!listeners.has(event)) {
    ipcRenderer.on(event, listener)
  }
}

export const executeAsync = function (options: ScriptRunnerItem) {
  return (dispatch: Function) => {

    const item: ScriptRunnerItem = {
      id: uuid.v4(),
      running: false,
      code: options.code,
      input: options.input,
      cron: options.cron,
      jobListeners: new Map<string, Function>()
    }

    addIpcRendererListener(item.jobListeners, JOB_RESULT, (event: any, arg: any) => {
      dispatch(notifyResult({
        ...item,
        result: arg.result
      }));
    });

    addIpcRendererListener(item.jobListeners, JOB_ERROR, (event: any, arg: any) => {
      dispatch(notifyError({
        ...item,
        error: arg.error
      }));
    });

    addIpcRendererListener(item.jobListeners, JOB_STARTED, (event: any, arg: any) => {
      dispatch(notifyStarted({
        ...item,
        jobId: arg.jobId,
        running: true
      }));
    });

    addIpcRendererListener(item.jobListeners, JOB_COMPLETED, (event: any, arg: any) => {
      dispatch(notifyCompleted({
        ...item,
        running: false
      }));
    });

    addIpcRendererListener(item.jobListeners, JOB_STOPPED, (event: any, arg: any) => {
      dispatch(notifyStopped({
        ...item,
        jobId: arg.jobId,
        running: false
      }));
    });

    ipcRenderer.send('job/START', item);

  }

}

