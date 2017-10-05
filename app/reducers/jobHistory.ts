import { IAction } from "../actions/helpers";
import { Actions } from "../actions";
/*import * as settings from "electron-settings";*/
import { IJobHistory } from "../actions/jobHistory";

export interface IJobHistoryState {
  jobHistories: Array<IJobHistory>;
}

const initialState: IJobHistoryState = {
  jobHistories: new Array<IJobHistory>()
};

/*
function saveToSettings(status: IJobHistory):void {
  const key:string = `jobs.${status.jobDefinition.jobId}`;
  settings.delete(key).set(key, status as any);
}


function setStatus(statuses: Array<IJobHistory>, status: IJobHistory):  Array<IJobHistory> {
  const filteredStatuses: Array<IJobHistory> = statuses.filter(x => x.jobDefinition.jobId !== status.jobDefinition.jobId);
  filteredStatuses.push(status);
  return filteredStatuses;
}*/

export function jobHistory(state:IJobHistoryState = initialState, action: IAction):any {

  if (Actions.JobManager.add.test(action)) {

    /*saveToSettingshistory);*/

    const newState: IJobHistoryState = {
      ...state
 /*      statuses: setStatus(state.statuses, status) */
    };
    return newState;
  }

  return state;
}

