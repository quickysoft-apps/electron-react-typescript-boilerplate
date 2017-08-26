import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import settings = require('electron-settings');
import { Job } from '../actions/jobRunner';

export interface JobManagerState {
  jobs: Map<string, Job>;
}

function saveToSettings(job: Job) {
  if (!job) return;
  const jobKey = `jobs[${job.jobId}]`;
  if (!settings.has(jobKey)) {
    settings.set(jobKey, JSON.stringify(job))
  }
}

export function jobManager(state: JobManagerState = { jobs: new Map<string, Job>() }, action: IAction) {

  if (Actions.JobManager.add.test(action)) {
    if (state.jobs.has(action.payload.jobId)) {
      state.jobs.set(action.payload.jobId, action.payload)
      saveToSettings(action.payload);
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

