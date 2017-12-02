import { ipcRenderer } from 'electron';
import { IAction, IActionWithPayload } from '../actions/helpers';
import { Actions } from '../actions';
import { IJob, ILibraryReference, Job } from '../actions/jobManager';

export interface IJobRunnerState {
  job: IJob;
  result?: object;
  scriptError?: object;
}

const initialState: IJobRunnerState = {
  job: new Job()
};

export function jobRunner(state: IJobRunnerState = initialState, action: IAction): IJobRunnerState {

  if (Actions.JobManager.select.test(action)) {
    return {
      ...state,
      job: action.payload
    };
  }

  if (Actions.JobRunner.started.test(action)) {
    return {
      ...state,
      job: {
        ...state.job,
        status: {
          ...state.job.status,
          isRunning: true
        }
      }
    };
  }

  if (Actions.JobRunner.resultChanged.test(action) && action.payload.jobId === state.job.id) {
    return {
      ...state,
      result: action.payload.result,
      scriptError: undefined
    };
  }

  if (Actions.JobRunner.error.test(action) && action.payload.jobId === state.job.id) {
    return {
      ...state,
      result: {},
      scriptError: action.payload.error ? action.payload.error : { message: 'Erreur de script non déterminée.' }
    };
  }

  if (Actions.JobRunner.completed.test(action) && action.payload.jobId === state.job.id) {
    return {
      ...state,
      job: {
        ...state.job,
        status: {
          ...state.job.status,
          isRunning: false
        }
      }
    };
  }

  if (Actions.JobRunner.stopped.test(action) && action.payload.jobId === state.job.id) {
    return {
      ...state,
      job: {
        ...state.job,
        status: {
          ...state.job.status,
          isRunning: false
        }
      }
    };
  }

  if (Actions.JobRunner.stop.test(action)) {
    ipcRenderer.send('ipc/JOB_STOP', { jobId: state.job.id });
    return state;
  }

  if (Actions.JobRunner.removeLibrary.test(action)) {
    const libraryName = (action as IActionWithPayload<string>).payload;
    const libraries = state.job.definition.libraries.filter(x => x.name !== libraryName);
    return {
      ...state,
      job: {
        ...state.job,
        definition: {
          ...state.job.definition,
          libraries
        }
      }
    };
  }

  if (Actions.JobRunner.addLibrary.test(action)) {
    const libraries = new Array<ILibraryReference>(...state.job.definition.libraries);
    const libraryReference = (action as IActionWithPayload<ILibraryReference>).payload;
    libraries.push(libraryReference);
    return {
      ...state,
      job: {
        ...state.job,
        definition: {
          ...state.job.definition,
          libraries
        }
      }
    };
  }

  return state;
}
