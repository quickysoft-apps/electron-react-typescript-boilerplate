import { actionCreator } from './helpers';
import { IJobStatus } from './jobManager';

export interface IJobHistory {
  scheduledTime?: Date;
  status: IJobStatus;
}

export const add = actionCreator<IJobStatus>('jobHistory/ADD');
