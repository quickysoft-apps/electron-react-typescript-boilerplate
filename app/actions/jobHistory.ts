import { actionCreator } from './helpers';
import { IJobStatus } from './jobManager';
import { IpcEventArg } from './jobRunner';

export interface IJobHistory {
  timestamp: Date;
  jobId: string;
  jobName: string;
  status: IJobStatus;
}

export const add = actionCreator<IpcEventArg>('jobHistory/ADD');
