import { actionCreator } from "./helpers";
import { JobDefinition } from "./jobRunner";
import { IJobStatus } from "./jobManager";

export interface IJobHistory {
  jobDefinition: JobDefinition;
  scheduleTime?: Date;
  status: IJobStatus;
}

// tslint:disable-next-line:typedef
export const add = actionCreator<JobDefinition>("jobHistory/ADD");
