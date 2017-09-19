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
  isRunning: boolean;
}

const initialState = {
  jobId: uuid.v4(),
  isRunning: false
}

export function jobRunner(state: JobRunnerState = initialState, action: IAction) {

  if (Actions.JobManager.select.test(action)) {
    return {
      ...state,
      script: action.payload.jobDefinition.script,
      jobId: action.payload.jobDefinition.jobId,
      cron: action.payload.jobDefinition.cron,
      input: action.payload.jobDefinition.input,
      isRunning: action.payload.isRunning
    };
  }

  if (Actions.JobRunner.started.test(action)) {
    return {
      ...state,
      jobId: action.payload.jobId,
      isRunning: true
    };
  }

  if (Actions.JobRunner.resultChanged.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      result: action.payload.result
    };
  }

  if (Actions.JobRunner.error.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      result: action.payload.error
    };
  }

  if (Actions.JobRunner.completed.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stop.test(action)) {
    ipcRenderer.send('ipc/JOB_STOP', state.jobId)
    return {
      ...state,
      isRunning: false
    };
  }

  return state;
}

