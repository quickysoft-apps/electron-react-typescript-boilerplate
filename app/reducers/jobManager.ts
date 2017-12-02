import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import * as settings from 'electron-settings';
import { IJob } from '../actions/jobManager';

type Jobs = IJob[];

export interface IJobManagerState {
  jobs: Jobs;
}

const initialState: IJobManagerState = {
  jobs: new Array<IJob>()
};

function saveToSettings(job: IJob): void {
  const key: string = `jobs.${job.id}`;
  settings.delete(key).set(key, job as any);
}

function updateJob(state: IJobManagerState, job: IJob): Jobs {
  const newJobs: Jobs = state.jobs.filter(x => x.id !== job.id);
  newJobs.push(job);
  return newJobs;
}

export function jobManager(state: IJobManagerState = initialState, action: IAction): any {

  let job: IJob | undefined;

  if (Actions.JobManager.add.test(action)) {
    job = action.payload;
    saveToSettings(job);
    return { jobs: updateJob(state, job) };
  }

  if (Actions.JobRunner.resultChanged.test(action)) {
    job = state.jobs.find(x => x.id === action.payload.jobId);
    if (job) {
      job.status.hasError = false;
      saveToSettings(job);
      return { jobs: updateJob(state, job) };
    }
    return state;
  }

  if (Actions.JobRunner.started.test(action)) {
    job = state.jobs.find(x => x.id === action.payload.jobId);
    if (job) {
      job.status.isRunning = true;
      saveToSettings(job);
      return { jobs: updateJob(state, job) };
    }
    return state;
  }

  if (Actions.JobRunner.stopped.test(action)) {
    job = state.jobs.find(x => x.id === action.payload.jobId);
    if (job) {
      job.status.isRunning = false;
      saveToSettings(job);
      return { jobs: updateJob(state, job) };
    }
    return state;
  }

  if (Actions.JobRunner.error.test(action)) {
    job = state.jobs.find(x => x.id === action.payload.jobId);
    if (job) {
      job.status.hasError = !!action.payload.error;
      saveToSettings(job);
      return { jobs: updateJob(state, job) };
    }
    return state;
  }

  if (Actions.JobRunner.completed.test(action)) {
    job = state.jobs.find(x => x.id === action.payload.jobId);
    if (job) {
      job.status.isRunning = false;
      saveToSettings(job);
      return { jobs: updateJob(state, job) };
    }
    return state;
  }

  if (Actions.JobManager.save.test(action)) {
    job = state.jobs.find(x => x.id === action.payload.id);
    if (job) {
      saveToSettings(action.payload);
      return { jobs: updateJob(state, action.payload) };
    }
  }

  return state;
}
