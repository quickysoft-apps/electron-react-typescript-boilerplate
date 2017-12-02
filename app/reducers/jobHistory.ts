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

export function jobHistory(state: IJobHistoryState = initialState, action: IAction): any {

  if (Actions.JobRunner.started.test(action)) {
    const maxHistory = Math.max(state.jobHistories.length - 100, 0);
    const jobHistories = new Array<IJobHistory>(...state.jobHistories).slice(maxHistory);
    const item: IJobHistory = {
      timestamp: new Date(),
      jobId: action.payload.jobId,
      jobName: action.payload.jobName,
      status: {
        isRunning: true,
        hasError: !!action.payload.error
      }
    };
    jobHistories.push(item);

    const key = 'jobHistory';
    settings.delete(key).set(key, jobHistories as any);

    return {
      ...state,
      jobHistories
    };
  }

  return state;
}
