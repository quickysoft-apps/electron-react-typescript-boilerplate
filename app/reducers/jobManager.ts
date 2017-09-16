import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import * as settings from 'electron-settings';
import { Job } from '../actions/jobRunner';

export interface JobManagerState {
  jobs: Array<Job>;
  selectedJob?: Job;
}

const initialState: JobManagerState = {
  jobs: new Array<Job>()
}

function saveToSettings(job: Job) {
  if (!job) return;
  const jobKey = `jobs.${job.jobId}`;
  if (!settings.has(jobKey)) {
    settings.set(jobKey, job as any);
  }
}

export function jobManager(state = initialState, action: IAction) {

  if (Actions.JobManager.add.test(action)) {
    if (!state.jobs.find(x => x.jobId === action.payload.jobId)) {
      const jobs = new Array<Job>(...state.jobs);
      jobs.push(action.payload)
      saveToSettings(action.payload);
      return {
        ...state,
        jobs
      }
    }
    return state;
  }

  if (Actions.JobManager.open.test(action)) {
    const job = state.jobs.find(x => x.jobId === action.payload.jobId);
    if (job) {
      return {
        ...state,
        selectedJob: job.jobId
      }
    } 
    return state;
  }

  if (Actions.JobRunner.notifyStarted.test(action)) {
    return state;
  }

  if (Actions.JobRunner.notifyStopped.test(action)) {
    return state;
  }

  if (Actions.JobRunner.notifyError.test(action)) {
    return state;
  }

  if (Actions.JobRunner.notifyCompleted.test(action)) {
    return state;
  }

  return state;
}

