import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { Job } from '../actions/jobRunner';

declare type JobManagerState = Map<string, Job>;

export function jobManager(state: JobManagerState = new Map<string, Job>(), action: IAction) {

  if (Actions.JobRunner.notifyStarted.test(action)) {
    return state;
  }

  if (Actions.JobRunner.notifyStopped.test(action)) {
    return state;
  }

  if (Actions.JobRunner.notifyError.test(action)) {
    return state;
  }

  if (Actions.JobRunner.notifyCompleted.test(action)) {
    return state;
  }

  return state;
}

