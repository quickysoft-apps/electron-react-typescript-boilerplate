import { actionCreator, actionCreatorVoid } from './helpers';

const { dialog, app } = require('electron').remote;
import * as fs from 'fs';
import * as path from 'path';

import { Ipc } from '../api/ipc';
import { ipcRenderer } from 'electron';
const ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  result?: any;
  error?: Object;
}

export interface LibraryReference {
  name: string;
  path: string;
}

export interface JobDefinition {
  jobId: string;
  cron?: string;
  script: string;
  input?: Object;
  title: string;  
  libraries: Array<LibraryReference>;
}

export const started = actionCreator<IpcEventArg>('jobRunner/STARTED');
export const resultChanged = actionCreator<IpcEventArg>('jobRunner/RESULT_CHANGED');
export const error = actionCreator<IpcEventArg>('jobRunner/ERROR');
export const completed = actionCreator<IpcEventArg>('jobRunner/COMPLETED');
export const stopped = actionCreator<IpcEventArg>('jobRunner/STOPPED');
export const stop = actionCreatorVoid('jobRunner/STOP');
export const save = actionCreator<JobDefinition>('jobRunner/SAVE');
export const start = function (job: JobDefinition) {
  return (dispatch: Function, getState: Function) => {

    ipc.addListener(job.jobId, 'ipc/JOB_RESULT', (event: any, arg: any) => {
      dispatch(resultChanged(arg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_ERROR', (event: any, arg: any) => {
      console.log('ipc/JOB_ERROR', arg)
      dispatch(error(arg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_STARTED', (event: any, arg: any) => {
      dispatch(started(arg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_COMPLETED', (event: any, arg: any) => {
      dispatch(completed(arg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_STOPPED', (event: any, arg: any) => {
      ipc.clearListeners(job.jobId);
      dispatch(stopped(arg));
    });

    const arg = {
      jobId: job.jobId,
      cron: job.cron,
      script: job.script,
      input: job.input
    }
    ipc.send('ipc/JOB_START', arg);

  }

}

export const removeLibrary = actionCreator<string>('jobRunner/REMOVE_LIBRARY');
export const libraryAdded = actionCreator<LibraryReference>('jobRunner/LIBRARY_ADDED');
export const addLibrary = function (jobId: string)  {
  return (dispatch: Function, getState: Function) => {
    
    const openDialogOptions: Electron.OpenDialogOptions = {
      title: 'Sélectionnez les fichiers à référencer',
      filters: [{ extensions: ['dll'], name: '.Net Assemblies' }],
      properties: ['openFile', 'multiSelections']
    }
    
    //Ensure libraries destination folder exists
    const librariesPath = path.join(app.getPath('userData'), 'libraries', jobId);
    if (!fs.existsSync(librariesPath)) {
      fs.mkdirSync(librariesPath);
    }

    dialog.showOpenDialog(openDialogOptions, (filePaths: string[]) => {
      if (filePaths === undefined) {
        return;
      }
      filePaths.map((filepath) => {
        const libraryName = path.basename(filepath);
        const destination = path.join(librariesPath, libraryName);
        fs.createReadStream(filepath).pipe(fs.createWriteStream(destination));
        const libraryReference: LibraryReference = {
          name: path.basename(filepath),
          path: destination
        }        
        dispatch(libraryAdded(libraryReference));
      })
    });
  }
}



