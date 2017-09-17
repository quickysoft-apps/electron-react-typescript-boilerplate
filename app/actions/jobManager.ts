import { actionCreator } from './helpers';
import { JobDefinition } from './jobRunner';

export interface JobStatus {
  jobDefinition: JobDefinition;
  isRunning: boolean;
}

export const add = actionCreator<JobDefinition>('jobManager/ADD');
export const select = actionCreator<JobStatus>('jobManager/SELECT');
