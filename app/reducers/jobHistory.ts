import { IAction } from "../actions/helpers";
import { Actions } from "../actions";
import * as settings from "electron-settings";
import { IJobHistory } from "../actions/jobHistory";

export interface IJobHistoryState {
  jobHistories: Array<IJobHistory>;
}

const initialState: IJobHistoryState = {
  jobHistories: new Array<IJobHistory>()
};

function saveToSettings(history: IJobHistory):void {
  const key:string = `jobs.${history.status.jobDefinition.jobId}`;
  settings.delete(key).set(key, history as any);
}

function setHistories(histories: Array<IJobHistory>, history: IJobHistory): Array<IJobHistory> {
  const listOfHistories: Array<IJobHistory> = histories.filter(x => x.status.jobDefinition.jobId !== history.status.jobDefinition.jobId);
  listOfHistories.push(history);
  return listOfHistories;
}

export function jobHistory(state: IJobHistoryState = initialState, action: IAction): any {
  if (Actions.JobRunner.start.test(action)) {
    const history: IJobHistory = {
      status: {
        jobDefinition: action.payload,
        isRunning: false,
        hasError: false
      },
      scheduledTime: new Date()
    };
    saveToSettings(history);
    const newState: IJobHistoryState = {
      jobHistories: setHistories(state.jobHistories, history)
    };

    return newState;
  }

  return state;
}

