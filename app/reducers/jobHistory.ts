import { Actions } from '../actions';
import { IAction, IActionWithPayload } from '../actions/helpers';
import { IJobHistory } from '../actions/jobHistory';
import { IpcEventArg } from '../actions/jobRunner';

export interface IJobHistoryState {
  jobHistories: IJobHistory[];
}

const initialState: IJobHistoryState = {
  jobHistories: new Array<IJobHistory>()
};

export function jobHistory(state: IJobHistoryState = initialState, action: IAction): any {

  if (Actions.JobRunner.started.test(action)) {
    const jobHistories = new Array<IJobHistory>(...state.jobHistories);
    const item: IJobHistory = {
      scheduledTime: new Date(),
      status: {
        jobId: (action as IActionWithPayload<IpcEventArg>).payload.jobId,
        jobName: (action as IActionWithPayload<IpcEventArg>).payload.jobName,
        isRunning: true,
        hasError: false
      }
    };
    jobHistories.push(item);
    return {
      ...state,
      jobHistories
    };
  }

  return state;
}
