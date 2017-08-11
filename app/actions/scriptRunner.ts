import { actionCreator } from './helpers';
import * as edgeApi from '../api/edge'

export interface ScriptRunnerResult {
  executionId: string;
  script: string;
  result: Object;
  error: Object;
}

export interface ScriptRunnerOptions {
  executionId: string;
  script: string;
  payload: any;
}

export const notifyExecuting = actionCreator<ScriptRunnerOptions>('scriptRunner/NOTIFY_EXECUTING');
export const notifyExecuted = actionCreator<ScriptRunnerResult>('scriptRunner/NOTIFY_EXECUTED');

export const executeAsync = function (options: ScriptRunnerOptions) {
  return (dispatch: Function) => {
    dispatch(notifyExecuting(options))
    const edgeFunction = edgeApi.getEdgeFunctionFromScript(options.script);
    edgeFunction(options.payload, (error: Object, result: Object) => {
      dispatch(notifyExecuted({
        executionId: options.executionId,
        script: options.script,
        result: result,
        error: error
      }));
    })
  };
}
