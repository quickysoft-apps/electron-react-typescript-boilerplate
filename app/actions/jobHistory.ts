/*import { actionCreator } from "./helpers";*/
import { IJobStatus } from "./jobManager";

export interface IJobHistory {
  scheduledTime?: Date;
  status: IJobStatus;
}

// tslint:disable-next-line:typedef
/*
export const add = actionCreator<IJobStatus>("jobHistory/ADD");
*/
