import { IAction } from '../actions/helpers';
import { IJobHistory } from '../actions/jobHistory';

export interface IJobHistoryState {
  jobHistories: IJobHistory[];
}

const initialState: IJobHistoryState = {
  jobHistories: new Array<IJobHistory>()
};

export function jobHistory(state: IJobHistoryState = initialState, action: IAction): any {

  return state;
}
