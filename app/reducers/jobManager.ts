import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import * as settings from 'electron-settings';
import { IJobStatus } from '../actions/jobManager';

type JobStatuses = IJobStatus[];

export interface IJobManagerState {
  statuses: JobStatuses;
}

const initialState: IJobManagerState = {
  statuses: new Array<IJobStatus>()
};

function saveToSettings(status: IJobStatus): void {
  const key: string = `jobs.${status.jobId}`;
  settings.delete(key).set(key, status as any);
}

function setStatus(statuses: IJobStatus[], status: IJobStatus): JobStatuses {
  const filteredStatuses: JobStatuses = statuses.filter(x => x.jobId !== status.jobId);
  filteredStatuses.push(status);
  return filteredStatuses;
}

export function jobManager(state: IJobManagerState = initialState, action: IAction): any {

  let status: IJobStatus | undefined;

  if (Actions.JobManager.add.test(action)) {
    status = {
      jobId: action.payload.jobId,
      jobName: action.payload.name,
      isRunning: false,
      hasError: false
    };
    saveToSettings(status);
    const newState: IJobManagerState = {
      statuses: setStatus(state.statuses, status)
    };
    return newState;
  }

  if (Actions.JobRunner.resultChanged.test(action)) {
    status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.hasError = false;

      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, status)
      };
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.started.test(action)) {
    status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.isRunning = true;

      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, status)
      };
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.stopped.test(action)) {
    status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.isRunning = false;
      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, status)
      };
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.error.test(action)) {
    status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.hasError = !!action.payload.error;
      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, status)
      };

      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.completed.test(action)) {
    status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.isRunning = false;
      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, status)
      };
      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.save.test(action)) {
    status = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      const newStatus: IJobStatus = {
        ...status,
        jobDefinition: action.payload
      };
      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, newStatus)
      };
      saveToSettings(newStatus);
      return newState;
    }
  }

  return state;
}
