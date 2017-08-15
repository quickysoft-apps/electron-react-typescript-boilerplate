import { ipcRenderer } from 'electron';
import { actionCreator } from './helpers';

export interface ScriptRunnerData {
  id?: string;
  cron?: any;
  script: string;
  input: any;
  result?: Object;
  error?: Object;
  resultListener?: Function,
  startedListener?: Function
}

export const notifyExecuting = actionCreator<ScriptRunnerData>('scriptRunner/NOTIFY_EXECUTING');
export const notifyExecuted = actionCreator<ScriptRunnerData>('scriptRunner/NOTIFY_EXECUTED');
export const stopCurrent = actionCreator<ScriptRunnerData>('scriptRunner/STOP_CURRENT');

export const executeAsync = function (options: ScriptRunnerData) {
  return (dispatch: Function) => {

    const data: ScriptRunnerData = {
      script: options.script,
      input: options.input,
      cron: '* * * * * *' //FORCE TOUTES lES SECOPNDES POUR TEST
    }

    const resultListener = (event: any, arg: any) => {
      dispatch(notifyExecuted({
        ...data,
        id: arg.id,
        result: arg.result
      }));
    }
    ipcRenderer.on('scriptRunner/RESULT', resultListener);

    const startedListener = (event: any, arg: any) => {
      dispatch(notifyExecuting({
        ...data,
        id: arg.id
      }));
    }
    ipcRenderer.on('scriptRunner/STARTED', startedListener);
    
    ipcRenderer.send('scriptRunner/START', {
      ...data,
      resultListener,
      startedListener
    });

  }

}

