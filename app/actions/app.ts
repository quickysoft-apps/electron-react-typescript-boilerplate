import { actionCreatorVoid, actionCreator } from "./helpers";
import settings = require("electron-settings");
import { start } from "./jobRunner";
import { add, IJobStatus } from "./jobManager";

// tslint:disable-next-line:typedef
export const hide = actionCreatorVoid("app/HIDE");
// tslint:disable-next-line:typedef
export const show = actionCreatorVoid("app/SHOW");
// tslint:disable-next-line:typedef
export const toggleMenu = actionCreator<boolean>("app/MENU");
// tslint:disable-next-line:typedef
export const back = actionCreatorVoid("app/BACK");
// tslint:disable-next-line:typedef
export const loadFromSettings = function () {
  return (dispatch: Function, getState: Function) => {
    const jobsSettings: any = settings.get("jobs");
    if (jobsSettings) {
      Object.keys(jobsSettings).forEach(key => {
        const status: IJobStatus = jobsSettings[key];
        dispatch(add(status.jobDefinition));
        if (status.isRunning) {
          dispatch(start(status.jobDefinition));
        }
      });
    }
  };
};

