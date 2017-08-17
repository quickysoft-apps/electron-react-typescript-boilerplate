import { ipcRenderer } from 'electron';
import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { ScriptRunnerItem } from '../actions/scriptRunner';


declare type ScriptHistoryState = Map<string, ScriptRunnerItem>;

export function scriptRunner(state: ScriptHistoryState = new Map<string, ScriptRunnerItem>(), action: IAction) {

  if (Actions.ScriptRunner.notifyStarted.test(action)) {            
    return state;
  }

  if (Actions.ScriptRunner.stopCurrent.test(action)) {
    if (state.current && state.current.jobId) {
      ipcRenderer.send('scriptRunner/STOP', state.current)
    }
    if (state.current && state.current.onJobResult) {
      ipcRenderer.removeListener('scriptRunner/RESULT', state.current.onJobResult);
    }
    if (state.current && state.current.onJobStarted) {
      ipcRenderer.removeListener('scriptRunner/STARTED', state.current.onJobStarted);
    }
    if (action.payload.jobId) {      
      state.runs.delete(action.payload.jobId)
    }
    const runs = new Map<string, ScriptRunnerItem>(state.runs);
    return {
      ...state,
      runs,
      running: false
    };
  }

  if (Actions.ScriptRunner.notifyCompleted.test(action)) {    
    if (action.payload.jobId) {      
      state.runs.delete(action.payload.jobId)
    }
    const runs = new Map<string, ScriptRunnerItem>(state.runs);
    return {
      ...state,
      runs,
      running: false
    };
  }

  return state;
}

