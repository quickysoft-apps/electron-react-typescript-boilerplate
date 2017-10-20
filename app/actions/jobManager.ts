import { actionCreator } from './helpers';
import { IJobDefinition } from './jobRunner';

export interface IJobStatus {
  jobDefinition: IJobDefinition;
  isRunning: boolean;
  hasError: boolean;
}

export const add = actionCreator<IJobDefinition>('jobManager/ADD');
export const select = actionCreator<IJobStatus>('jobManager/SELECT');
