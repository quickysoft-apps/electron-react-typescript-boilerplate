import { Actions } from '../actions';
import { IAction } from '../actions/helpers';
import { IJobHistory } from '../actions/jobHistory';

import * as settings from 'electron-settings';

export interface IJobHistoryState {
  jobHistories: IJobHistory[];
}

const initialState: IJobHistoryState = {
  jobHistories: new Array<IJobHistory>()
};

function updateHistory(state: IJobHistoryState, item: IJobHistory): IJobHistoryState {
  const maxHistory = Math.max(state.jobHistories.length - 100, 0);
  const jobHistories = new Array<IJobHistory>(...state.jobHistories).slice(maxHistory);
  jobHistories.push(item);
  const key = 'jobHistory';
  settings.delete(key).set(key, jobHistories as any);
  return {
    ...state,
    jobHistories
  };
}

export function jobHistory(state: IJobHistoryState = initialState, action: IAction): any {

  let item: IJobHistory;

  if (Actions.JobRunner.started.test(action)) {
    item = {
      timestamp: new Date(),
      jobId: action.payload.jobId,
      jobName: action.payload.jobName,
      status: {
        isRunning: true,
        hasError: !!action.payload.error
      }
    };
    return updateHistory(state, item);
  }

  if (Actions.JobRunner.stopped.test(action)) {
    item = {
      timestamp: new Date(),
      jobId: action.payload.jobId,
      jobName: action.payload.jobName,
      status: {
        isRunning: false,
        hasError: !!action.payload.error
      }
    };
    return updateHistory(state, item);
  }

  if (Actions.JobRunner.completed.test(action)) {
    item = {
      timestamp: new Date(),
      jobId: action.payload.jobId,
      jobName: action.payload.jobName,
      status: {
        isRunning: false,
        hasError: !!action.payload.error
      }
    };
    return updateHistory(state, item);
  }

  if (Actions.JobRunner.error.test(action)) {
    item = {
      timestamp: new Date(),
      jobId: action.payload.jobId,
      jobName: action.payload.jobName,
      status: {
        isRunning: false,
        hasError: !!action.payload.error
      }
    };
    return updateHistory(state, item);
  }

  return state;
}
