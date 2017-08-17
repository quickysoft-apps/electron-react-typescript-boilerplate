import { ipcRenderer } from 'electron';
import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

export interface ScriptRunnerState {
  jobId?: string;
  cron?: any;
  code?: string;
  input?: any;
  result?: Object;
  error?: Object;
  running: boolean;
}

const initialState = {
  running: false
}

export function scriptRunner(state: ScriptRunnerState = initialState, action: IAction) {

  if (Actions.ScriptRunner.notifyStarted.test(action)) {
    return {
      ...state,
      jobId: action.payload.jobId,
      cron: action.payload.cron,
      code: action.payload.code,
      input: action.payload.input,
      running: true
    };
  }

  if (Actions.ScriptRunner.notifyResult.test(action)) {
    return {
      ...state,
      result: action.payload.result,
      error: action.payload.error
    };
  }

  if (Actions.ScriptRunner.stop.test(action)) {
    if (state.jobId) {
      ipcRenderer.send('job/STOP', state.jobId)
      //Remove listeners
    }
    return {
      ...state,
      running: false
    };
  }

  if (Actions.ScriptRunner.notifyCompleted.test(action)) {
    return {
      ...state,
      running: action.payload.running
    };
  }

  return state;
}

