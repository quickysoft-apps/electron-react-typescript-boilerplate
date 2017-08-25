import { ipcRenderer } from 'electron';
import * as uuid from 'uuid';
import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

export interface JobRunnerState {
  jobId: string;
  cron?: any;
  script?: string;
  input?: any;
  result?: Object;
  error?: Object;
  running: boolean;
}

const initialState = {
  jobId: uuid.v4(),
  running: false
}

export function jobRunner(state: JobRunnerState = initialState, action: IAction) {

  if (Actions.JobRunner.notifyStarted.test(action)) {
    return {
      ...state,
      jobId: action.payload.jobId,
      running: true
    };
  }

  if (Actions.JobRunner.notifyResult.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      result: action.payload.result
    };
  }

  if (Actions.JobRunner.notifyError.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      result: action.payload.error
    };
  }

  if (Actions.JobRunner.notifyCompleted.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      running: false
    };
  }

  if (Actions.JobRunner.stop.test(action)) {
    ipcRenderer.send('ipc/JOB_STOP', state.jobId)
    return {
      ...state,
      running: false
    };
  }

  return state;
}

