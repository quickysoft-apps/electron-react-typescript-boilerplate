import { actionCreator } from './helpers';
import Consts from '../utils/consts';
import * as uuid from 'uuid';

export interface ILibraryReference {
  name: string;
  path: string;
}

export interface IJobStatus {
  isRunning: boolean;
  hasError: boolean;
}

export interface IJobDefinition {
  cron?: string;
  script?: string;
  input?: object;
  name: string;
  libraries: ILibraryReference[];
}

export interface IJob {
  id: string;
  definition: IJobDefinition;
  status: IJobStatus;
}

export const add = actionCreator<IJob>('jobManager/ADD');
export const select = actionCreator<IJob>('jobManager/SELECT');
export const save = actionCreator<IJob>('jobRunner/SAVE');

export class Job implements IJob {

  public definition: IJobDefinition;
  public status: IJobStatus;
  public id: string;

  constructor() {
    this.id = uuid.v4();
    this.status = {
      isRunning: false,
      hasError: false
    };
    this.definition = {
      name: 'nouveau_script',
      cron: '*/5 * * * * *',
      input: undefined,
      libraries: new Array<ILibraryReference>(),
      script: Consts.DEFAULT_SCRIPT
    };
  }

}
