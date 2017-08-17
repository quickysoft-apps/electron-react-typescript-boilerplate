import { actionCreator } from './helpers';

export interface ScriptHistoryItem {
  id: string;
  jobId?: string;  
  cron?: any;
  code: string;
  input: any;
  result?: Object;
  error?: Object;  
}

export const add = actionCreator<ScriptHistoryItem>('scriptHistory/ADD');