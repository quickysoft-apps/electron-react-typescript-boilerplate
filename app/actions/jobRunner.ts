import { actionCreator, actionCreatorVoid, IAction, IActionCreator, IThunkAction, IDispatch, thunkActionCreator } from './helpers';
import { ThunkAction } from 'redux-thunk';

import { dialog, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

import { Ipc } from '../api/ipc';
import { ipcRenderer } from 'electron';
const ipc: Ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  result?: any;
  error?: object;
}

export interface ILibraryReference {
  name: string;
  path: string;
}

export interface IJobDefinition {
  jobId: string;
  cron?: string;
  script: string;
  input?: object;
  title: string;
  libraries: ILibraryReference[];
}

export const started = actionCreator<IpcEventArg>('jobRunner/STARTED');
export const resultChanged = actionCreator<IpcEventArg>('jobRunner/RESULT_CHANGED');
export const error = actionCreator<IpcEventArg>('jobRunner/ERROR');
export const completed = actionCreator<IpcEventArg>('jobRunner/COMPLETED');
export const stopped = actionCreator<IpcEventArg>('jobRunner/STOPPED');
export const stop = actionCreatorVoid('jobRunner/STOP');
export const save = actionCreator<IJobDefinition>('jobRunner/SAVE');

export const start = thunkActionCreator((job: IJobDefinition, dispatch: IDispatch): void => {
  ipc.addListener(job.jobId, 'ipc/JOB_RESULT', (event: any, eventArg: any) => {
    dispatch(resultChanged(eventArg));
  });

  ipc.addListener(job.jobId, 'ipc/JOB_ERROR', (event: any, eventArg: any) => {
    dispatch(error(eventArg));
  });

  ipc.addListener(job.jobId, 'ipc/JOB_STARTED', (event: any, eventArg: any) => {
    dispatch(started(eventArg));
  });

  ipc.addListener(job.jobId, 'ipc/JOB_COMPLETED', (event: any, eventArg: any) => {
    dispatch(completed(eventArg));
  });

  ipc.addListener(job.jobId, 'ipc/JOB_STOPPED', (event: any, eventArg: any) => {
    ipc.clearListeners(job.jobId);
    dispatch(stopped(eventArg));
  });

  const arg: IJobDefinition = {
    jobId: job.jobId,
    cron: job.cron,
    script: job.script,
    input: job.input,
    title: job.title,
    libraries: job.libraries
  };
  ipc.send('ipc/JOB_START', arg);

});

export const start1 = (job: IJobDefinition): IThunkAction => {
  return (dispatch: IDispatch): void => {

    ipc.addListener(job.jobId, 'ipc/JOB_RESULT', (event: any, eventArg: any) => {
      dispatch(resultChanged(eventArg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_ERROR', (event: any, eventArg: any) => {
      dispatch(error(eventArg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_STARTED', (event: any, eventArg: any) => {
      dispatch(started(eventArg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_COMPLETED', (event: any, eventArg: any) => {
      dispatch(completed(eventArg));
    });

    ipc.addListener(job.jobId, 'ipc/JOB_STOPPED', (event: any, eventArg: any) => {
      ipc.clearListeners(job.jobId);
      dispatch(stopped(eventArg));
    });

    const arg: IJobDefinition = {
      jobId: job.jobId,
      cron: job.cron,
      script: job.script,
      input: job.input,
      title: job.title,
      libraries: job.libraries
    };
    ipc.send('ipc/JOB_START', arg);

  };

};

export const removeLibrary: IActionCreator<string> = actionCreator<string>('jobRunner/REMOVE_LIBRARY');
export const libraryAdded: IActionCreator<ILibraryReference> = actionCreator<ILibraryReference>('jobRunner/LIBRARY_ADDED');

type AddLibraryAction = (jobId: string) => ThunkAction<void, IAction, void>;
export const addLibrary: AddLibraryAction = (jobId: string): ThunkAction<void, IAction, void> => {
  return (dispatch: (action: IAction) => void): void => {

    const openDialogOptions: Electron.OpenDialogOptions = {
      title: 'Sélectionnez les fichiers à référencer',
      filters: [{ extensions: ['dll'], name: '.Net Assemblies' }],
      properties: ['openFile', 'multiSelections']
    };

    // Ensure libraries destination folder exists
    const librariesPath: string = path.join(app.getPath('userData'), 'libraries', jobId);
    if (!fs.existsSync(librariesPath)) {
      fs.mkdirSync(librariesPath);
    }

    dialog.showOpenDialog(openDialogOptions, (filePaths: string[]) => {
      if (filePaths === undefined) {
        return;
      }
      filePaths.map((filepath: string) => {
        const libraryName: string = path.basename(filepath);
        const destination: string = path.join(librariesPath, libraryName);
        fs.createReadStream(filepath).pipe(fs.createWriteStream(destination));
        const libraryReference: ILibraryReference = {
          name: path.basename(filepath),
          path: destination
        };
        dispatch(libraryAdded(libraryReference));
      });
    });
  };
};
