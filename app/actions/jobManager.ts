import { actionCreator } from "./helpers";
import { IJobDefinition } from "./jobRunner";

export interface IJobStatus {
  jobDefinition: IJobDefinition;
  isRunning: boolean;
  hasError: boolean;
}

// tslint:disable-next-line:typedef
export const add = actionCreator<IJobDefinition>("jobManager/ADD");
// tslint:disable-next-line:typedef
export const select = actionCreator<IJobStatus>("jobManager/SELECT");
