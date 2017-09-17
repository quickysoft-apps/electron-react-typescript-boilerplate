import { actionCreatorVoid, actionCreator } from './helpers';
import settings = require('electron-settings');
import { start } from './jobRunner';
import { add, JobStatus } from './jobManager';

export const hide = actionCreatorVoid('app/HIDE');
export const show = actionCreatorVoid('app/SHOW');
export const toggleMenu = actionCreator<boolean>('app/MENU');
export const back = actionCreatorVoid('app/BACK');
export const loadFromSettings = function () {
  return (dispatch: Function, getState: Function) => {
    const jobsSettings: any = settings.get('jobs');
    if (jobsSettings) {
      Object.keys(jobsSettings).forEach(key => {
        const status: JobStatus = jobsSettings[key];
        dispatch(add(status.jobDefinition));
        if (status.isRunning) {
          dispatch(start(status.jobDefinition));
        }
      });
    }
  }
}

