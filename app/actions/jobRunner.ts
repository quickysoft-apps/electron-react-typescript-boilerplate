import { actionCreator, actionCreatorVoid, IDispatch, IThunkAction } from './helpers';

import { remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

import { Ipc } from '../api/ipc';
import { ipcRenderer } from 'electron';
import { IJob, ILibraryReference } from './jobManager';
const ipc: Ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  jobName: string;
  result?: any;
  error?: object;
}

export const started = actionCreator<IpcEventArg>('jobRunner/STARTED');
export const resultChanged = actionCreator<IpcEventArg>('jobRunner/RESULT_CHANGED');
export const error = actionCreator<IpcEventArg>('jobRunner/ERROR');
export const completed = actionCreator<IpcEventArg>('jobRunner/COMPLETED');
export const stopped = actionCreator<IpcEventArg>('jobRunner/STOPPED');
export const stop = actionCreatorVoid('jobRunner/STOP');

export const start = (job: IJob): IThunkAction => (dispatch: IDispatch): void => {

  ipc.addListener(job.id, 'ipc/JOB_RESULT', (event: any, eventArg: any) => {
    dispatch(resultChanged({
      jobId: eventArg.jobId,
      jobName: job.definition.name,
      result: eventArg.result
    }));
  });

  ipc.addListener(job.id, 'ipc/JOB_ERROR', (event: any, eventArg: any) => {
    dispatch(error(eventArg));
  });

  ipc.addListener(job.id, 'ipc/JOB_STARTED', (event: any, eventArg: any) => {
    dispatch(started({
      jobId: eventArg.id,
      jobName: job.definition.name
    }));
  });

  ipc.addListener(job.id, 'ipc/JOB_COMPLETED', (event: any, eventArg: any) => {
    dispatch(completed({
      jobId: eventArg.jobId,
      jobName: job.definition.name
    }));
  });

  ipc.addListener(job.id, 'ipc/JOB_STOPPED', (event: any, eventArg: any) => {
    ipc.clearListeners(job.id);
    dispatch(stopped({
      jobId: eventArg.jobId,
      jobName: job.definition.name
    }));

  });

  const arg = {
    jobId: job.id,
    cron: job.definition.cron,
    script: job.definition.script,
    input: job.definition.input,
    libraries: job.definition.libraries
  };
  ipc.send('ipc/JOB_START', arg);

};

export const removeLibrary = actionCreator<string>('jobRunner/REMOVE_LIBRARY');
export const addLibrary = actionCreator<ILibraryReference>('jobRunner/LIBRARY_ADDED');

export const openLibraryFromDisk = (jobId: string): IThunkAction => (dispatch: IDispatch): void => {

  const openDialogOptions: Electron.OpenDialogOptions = {
    title: 'Sélectionnez les fichiers à référencer',
    filters: [{ extensions: ['dll'], name: '.Net Assemblies' }],
    properties: ['openFile', 'multiSelections']
  };

  // Ensure libraries destination folder exists
  const librariesPath = path.join(remote.app.getPath('userData'), 'libraries', jobId);
  if (!fs.existsSync(librariesPath)) {
    fs.mkdirSync(librariesPath);
  }

  remote.dialog.showOpenDialog(openDialogOptions, (filePaths: string[]) => {
    if (filePaths === undefined) {
      return;
    }
    filePaths.map(filepath => {
      const libraryName = path.basename(filepath);
      const destination = path.join(librariesPath, libraryName);
      fs.createReadStream(filepath).pipe(fs.createWriteStream(destination));
      const libraryReference: ILibraryReference = {
        name: path.basename(filepath),
        path: destination
      };
      dispatch(addLibrary(libraryReference));
    });
  });
};
