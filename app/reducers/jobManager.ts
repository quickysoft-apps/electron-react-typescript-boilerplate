import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import * as settings from 'electron-settings';
import { JobStatus } from '../actions/jobManager';

export interface JobManagerState {
  statuses: Array<JobStatus>;
}

const initialState: JobManagerState = {
  statuses: new Array<JobStatus>()
}

function saveToSettings(status: JobStatus) {
  const key = `jobs.${status.jobDefinition.jobId}`;
  settings.delete(key).set(key, status as any);
}

function setStatus(statuses: Array<JobStatus>, status: JobStatus) {
  const filteredStatuses = statuses.filter(x => x.jobDefinition.jobId !== status.jobDefinition.jobId);
  filteredStatuses.push(status);
  return filteredStatuses;
}

export function jobManager(state = initialState, action: IAction) {

  if (Actions.JobManager.add.test(action)) {
    const status: JobStatus = {
      jobDefinition: action.payload,
      isRunning: false
    };
    saveToSettings(status);
    const newState: JobManagerState = {
      ...state,
      statuses: setStatus(state.statuses, status)
    }
    return newState;
  }

  if (Actions.JobRunner.started.test(action)) {
    let status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.isRunning = true;
      const newState: JobManagerState = {
        ...state,
        statuses: setStatus(state.statuses, status)
      }
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.stopped.test(action)) {
    let status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.isRunning = false;
      const newState: JobManagerState = {
        ...state,
        statuses: setStatus(state.statuses, status)
      }
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.error.test(action)) {
    return state;
  }

  if (Actions.JobRunner.completed.test(action)) {
    let status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.isRunning = false;
      const newState: JobManagerState = {
        ...state,
        statuses: setStatus(state.statuses, status)
      }
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.save.test(action)) {
    const status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      const newStatus: JobStatus = {
        jobDefinition: action.payload,
        isRunning: status.isRunning
      };
      const newState: JobManagerState = {
        ...state,
        statuses: setStatus(state.statuses, newStatus)
      };
      saveToSettings(newStatus);
      return newState;
    }
  }

  return state;
}

