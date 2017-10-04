import { actionCreator, actionCreatorVoid, IActionCreator, IActionCreatorVoid } from "./helpers";

import { Ipc } from "../api/ipc";
import { ipcRenderer } from "electron";
const ipc:Ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  result?: any;
  error?: Object;
}

export interface ILibraryReference {
  name: string;
  content: Uint8Array;
}

export interface IJobDefinition {
  jobId: string;
  cron?: string;
  script: string;
  input?: Object;
  title: string;
  libraries: Array<ILibraryReference>;
}

export const started:IActionCreator<IpcEventArg> = actionCreator<IpcEventArg>("jobRunner/STARTED");
export const resultChanged:IActionCreator<IpcEventArg> = actionCreator<IpcEventArg>("jobRunner/RESULT_CHANGED");
export const error:IActionCreator<IpcEventArg> = actionCreator<IpcEventArg>("jobRunner/ERROR");
export const completed:IActionCreator<IpcEventArg> = actionCreator<IpcEventArg>("jobRunner/COMPLETED");
export const stopped:IActionCreator<IpcEventArg> = actionCreator<IpcEventArg>("jobRunner/STOPPED");
export const stop:IActionCreatorVoid = actionCreatorVoid("jobRunner/STOP");
export const save:IActionCreator<IJobDefinition> = actionCreator<IJobDefinition>("jobRunner/SAVE");

export const addLibrary:IActionCreator<number> = actionCreator<number>("jobRunner/ADD_LIBRARY");

// tslint:disable-next-line:typedef
export const start = function (job: IJobDefinition) {
  return (dispatch: Function, getState: Function) => {

    ipc.addListener(job.jobId, "ipc/JOB_RESULT", (event: any, arg: any) => {
      dispatch(resultChanged(arg));
    });

    ipc.addListener(job.jobId, "ipc/JOB_ERROR", (event: any, arg: any) => {
      console.log("ipc/JOB_ERROR", arg);
      dispatch(error(arg));
    });

    ipc.addListener(job.jobId, "ipc/JOB_STARTED", (event: any, arg: any) => {
      dispatch(started(arg));
    });

    ipc.addListener(job.jobId, "ipc/JOB_COMPLETED", (event: any, arg: any) => {
      dispatch(completed(arg));
    });

    ipc.addListener(job.jobId, "ipc/JOB_STOPPED", (event: any, arg: any) => {
      ipc.clearListeners(job.jobId);
      dispatch(stopped(arg));
    });

    // tslint:disable-next-line:typedef
    const arg = {
      jobId: job.jobId,
      cron: job.cron,
      script: job.script,
      input: job.input
    };
    ipc.send("ipc/JOB_START", arg);

  };

};

