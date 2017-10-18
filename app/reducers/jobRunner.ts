import { ipcRenderer } from 'electron';
import * as uuid from 'uuid';
import { IAction, IActionWithPayload } from '../actions/helpers';
import { Actions } from '../actions';
import { LibraryReference } from '../actions/jobRunner';

export interface JobRunnerState {
  jobId: string;
  cron?: any;
  script?: string;
  title?: string;
  input?: Object;
  libraries: Array<LibraryReference>;
  result?: Object;
  scriptError?: Object;
  isRunning: boolean;
}

const initialState: {
  jobId: string,
  isRunning: boolean,
  input: undefined,
  libraries: Array<ILibraryReference>
} = {
  jobId: uuid.v4(),
  isRunning: false,
  input: undefined,
  libraries: new Array<ILibraryReference>()
};

// tslint:disable-next-line:typedef
export function jobRunner(state: IJobRunnerState = initialState, action: IAction) {

  if (Actions.JobManager.select.test(action)) {
    return {
      ...state,
      ...action.payload.jobDefinition,
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
      result: action.payload.result,
      scriptError: undefined
    };
  }

  if (Actions.JobRunner.error.test(action) && action.payload.jobId === state.jobId) {
    console.log("action.payload.error", action.payload.error);
    return {
      ...state,
      result: {},
      scriptError: action.payload.error ? action.payload.error : undefined
    };
  }

  if (Actions.JobRunner.completed.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stopped.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stop.test(action)) {
    ipcRenderer.send('ipc/JOB_STOP', { jobId: state.jobId })
    return state;    
  }

  if (Actions.JobRunner.removeLibrary.test(action)) {
    const libraryName = (action as IActionWithPayload<string>).payload;
    const libraries: Array<LibraryReference> = state.libraries.filter(x => x.name !== libraryName);
    return {   
      ...state,
      libraries
    };
  }

  if (Actions.JobRunner.libraryAdded.test(action)) {
    const libraries = new Array<LibraryReference>(...state.libraries);
    const libraryReference = (action as IActionWithPayload<LibraryReference>).payload;
    libraries.push(libraryReference);
    return {   
      ...state,
      libraries
    };
  }

  return state;
}

