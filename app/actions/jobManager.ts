import { actionCreator } from './helpers';

export interface Job {
  id: string;
  windowId?: string;  
  cron?: any;
  code: string;
  input: any;
  result?: Object;
  error?: Object;  
}

export const add = actionCreator<Job>('jobManager/ADD');