import { actionCreatorVoid, actionCreator, IThunkAction, IDispatch } from './helpers';
import settings = require('electron-settings');
import { start } from './jobRunner';
import { add, IJob } from './jobManager';

export const hide = actionCreatorVoid('app/HIDE');
export const show = actionCreatorVoid('app/SHOW');
export const toggleMenu = actionCreator<boolean>('app/MENU');
export const back = actionCreatorVoid('app/BACK');

export const loadFromSettings = (): IThunkAction => (dispatch: IDispatch): void => {
  const jobsSettings: any = settings.get('jobs');
  if (jobsSettings) {
    Object.keys(jobsSettings).forEach(key => {
      const job: IJob = jobsSettings[key];
      dispatch(add(job));
      if (job.status.isRunning) {
        dispatch(start(job));
      }
    });
  }
};
