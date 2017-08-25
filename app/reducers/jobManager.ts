//import { ipcRenderer } from 'electron';
import { IAction } from '../actions/helpers';
//import { Actions } from '../actions';
import { Job } from '../actions/jobRunner';


declare type JobManagerState = Map<string, Job>;

export function jobManager(state: JobManagerState = new Map<string, Job>(), action: IAction) {

  // if (Actions.JobRunner.notifyStarted.test(action)) {            
  //   return state;
  // }

  // if (Actions.JobRunner.stop.test(action)) {
  //   if (state.current && state.current.windowId) {
  //     ipcRenderer.send('scriptRunner/STOP', state.current)
  //   }
  //   if (state.current && state.current.onJobResult) {
  //     ipcRenderer.removeListener('scriptRunner/RESULT', state.current.onJobResult);
  //   }
  //   if (state.current && state.current.onJobStarted) {
  //     ipcRenderer.removeListener('scriptRunner/STARTED', state.current.onJobStarted);
  //   }
  //   if (action.payload.windowId) {      
  //     state.runs.delete(action.payload.windowId)
  //   }
  //   const runs = new Map<string, ScriptRunnerItem>(state.runs);
  //   return {
  //     ...state,
  //     runs,
  //     running: false
  //   };
  // }

  // if (Actions.ScriptRunner.notifyCompleted.test(action)) {    
  //   if (action.payload.windowId) {      
  //     state.runs.delete(action.payload.windowId)
  //   }
  //   const runs = new Map<string, ScriptRunnerItem>(state.runs);
  //   return {
  //     ...state,
  //     runs,
  //     running: false
  //   };
  // }

  return state;
}

