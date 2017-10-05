import { IAction } from "../actions/helpers";
import { Actions } from "../actions";
import * as settings from "electron-settings";
import { IJobStatus } from "../actions/jobManager";

export interface IJobManagerState {
  statuses: Array<IJobStatus>;
}

const initialState: IJobManagerState = {
  statuses: new Array<IJobStatus>()
};

function saveToSettings(status: IJobStatus):void {
  const key:string = `jobs.${status.jobDefinition.jobId}`;
  settings.delete(key).set(key, status as any);
}

function setStatus(statuses: Array<IJobStatus>, status: IJobStatus):  Array<IJobStatus> {
  const filteredStatuses: Array<IJobStatus> = statuses.filter(x => x.jobDefinition.jobId !== status.jobDefinition.jobId);
  filteredStatuses.push(status);
  return filteredStatuses;
}

export function jobManager(state:IJobManagerState = initialState, action: IAction):any {

  if (Actions.JobManager.add.test(action)) {
    const status: IJobStatus = {
      jobDefinition: action.payload,
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
    let status:IJobStatus | undefined = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
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
    let status:IJobStatus | undefined = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
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
    let status:IJobStatus | undefined = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
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
    let status:IJobStatus | undefined = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
    if (status) {
      status.hasError = !!action.payload.error;
      const newState: IJobManagerState = {
        statuses: setStatus(state.statuses, status)
      };
      console.log("newState", newState);

      saveToSettings(status);
      return newState;
    } else {
      return state;
    }
  }

  if (Actions.JobRunner.completed.test(action)) {
    let status:IJobStatus | undefined = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
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
    const status:IJobStatus | undefined = state.statuses.find(x => x.jobDefinition.jobId === action.payload.jobId);
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

