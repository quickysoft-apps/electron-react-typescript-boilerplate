import { actionCreator } from "./helpers";
import { JobDefinition } from "./jobRunner";

export interface IJobStatus {
  jobDefinition: JobDefinition;
  isRunning: boolean;
  hasError: boolean;
}

// tslint:disable-next-line:typedef
export const add = actionCreator<JobDefinition>("jobManager/ADD");
// tslint:disable-next-line:typedef
export const select = actionCreator<IJobStatus>("jobManager/SELECT");
