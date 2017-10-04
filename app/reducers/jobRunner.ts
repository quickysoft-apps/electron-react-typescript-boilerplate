import { ipcRenderer } from "electron";
const { dialog } = require("electron").remote;
import * as fs from "fs";
import * as uuid from "uuid";
import { IAction } from "../actions/helpers";
import { Actions } from "../actions";
import { ILibraryReference } from "../actions/jobRunner";

export interface IJobRunnerState {
  jobId: string;
  cron?: any;
  script?: string;
  title?: string;
  input?: Object;
  libraries: Array<ILibraryReference>;
  result?: Object;
  scriptError?: Object;
  isRunning: boolean;
}

const initialState: {
  jobId: string,
  isRunning: boolean,
  input: undefined,
  libraries: Array<ILibraryReference>
} = {
  jobId: uuid.v4(),
  isRunning: false,
  input: undefined,
  libraries: new Array<ILibraryReference>()
};

// tslint:disable-next-line:typedef
export function jobRunner(state: IJobRunnerState = initialState, action: IAction) {

  if (Actions.JobManager.select.test(action)) {
    return {
      ...state,
      ...action.payload.jobDefinition,
      isRunning: action.payload.isRunning
    };
  }

  if (Actions.JobRunner.started.test(action)) {
    return {
      ...state,
      jobId: action.payload.jobId,
      isRunning: true
    };
  }

  if (Actions.JobRunner.resultChanged.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      result: action.payload.result,
      scriptError: undefined
    };
  }

  if (Actions.JobRunner.error.test(action) && action.payload.jobId === state.jobId) {
    console.log("action.payload.error", action.payload.error);
    return {
      ...state,
      result: {},
      scriptError: action.payload.error ? action.payload.error : undefined
    };
  }

  if (Actions.JobRunner.completed.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stopped.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stop.test(action)) {
    ipcRenderer.send("ipc/JOB_STOP", { jobId: state.jobId });
    return {
      ...state
    };
  }

  if (Actions.JobRunner.addLibrary.test(action)) {
    const openDialogOptions: Electron.OpenDialogOptions = {
      title: "Sélectionnez les fichiers à référencer",
      filters: [{ extensions: [".dll"], name: ".Net Assemblies" }],
      properties: ["openFile", "multiSelections"]
    };

    dialog.showOpenDialog(openDialogOptions, (filePaths: string[]) => {
      if (filePaths === undefined) {
        return;
      }
      filePaths.map((filepath) => {
        fs.readFile(filepath, "utf-8", (err, data) => {
          if (err) {
            console.warn("An error ocurred reading the file :" + err.message);
            return;
          }
          // console.log("The jobId  is : " + action.payload);
          console.log("The file content is : " + data);
        });
      });

    });
  }

  return state;
}

