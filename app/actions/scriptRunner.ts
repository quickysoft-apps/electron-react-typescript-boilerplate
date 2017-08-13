import { CronJob } from 'cron';
import * as uuid from 'uuid';
import { actionCreator, actionCreatorVoid } from './helpers';
import * as edgeApi from '../api/edge'

export interface ScriptRunnerData {
  id?: string;
  script: string;
  input: any;
  result?: Object;
  error?: Object;
  job?: CronJob;
}

export const notifyExecuting = actionCreator<ScriptRunnerData>('scriptRunner/NOTIFY_EXECUTING');
export const notifyExecuted = actionCreator<ScriptRunnerData>('scriptRunner/NOTIFY_EXECUTED');
export const stopCurrent = actionCreatorVoid('scriptRunner/STOP_CURRENT');

export const executeAsync = function (options: ScriptRunnerData) {
  return (dispatch: Function) => {
    const edgeFunction = edgeApi.getEdgeFunctionFromScript(options.script);
    let data: ScriptRunnerData = {
      id: uuid.v4(),
      script: options.script,
      input: options.input,
      job: new CronJob('* * * * * *', () => {
        try {
          const result = edgeFunction(options.input, true);
          data.result = result;
        } catch (error) {
          data.error = error;
        }
        dispatch(notifyExecuted(data));
      }, undefined, false, 'Europe/Paris')
    }
    if (data.job) {
      dispatch(notifyExecuting(data));
      data.job.start();
    }
  };
}
