import { ipcRenderer } from 'electron';
import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { ScriptRunnerData } from '../actions/scriptRunner';

export interface ScriptRunnerState {
  current?: ScriptRunnerData;
  running: boolean;
  runs: Map<string, ScriptRunnerData>;
}

const initialState = {
  running: false,
  runs: new Map<string, ScriptRunnerData>()
}

export function scriptRunner(state: ScriptRunnerState = initialState, action: IAction) {

  if (Actions.ScriptRunner.notifyExecuting.test(action)) {        
    if (action.payload.id) {
      state.runs.set(action.payload.id, action.payload);
    }
    const runs = new Map<string, ScriptRunnerData>(state.runs);
    return {
      ...state,
      running: true,
      runs
    };
  }

  if (Actions.ScriptRunner.notifyExecuted.test(action)) {
    return {
      ...state,
      current: { ...action.payload }
    };
  }

  if (Actions.ScriptRunner.stopCurrent.test(action)) {
    if (state.current && state.current.id) {
      ipcRenderer.send('scriptRunner/STOP', state.current)
    }
    if (state.current && state.current.resultListener) {
      ipcRenderer.removeListener('scriptRunner/RESULT', state.current.resultListener);
    }
    if (state.current && state.current.startedListener) {
      ipcRenderer.removeListener('scriptRunner/STARTED', state.current.startedListener);
    }
    if (action.payload.id) {      
      state.runs.delete(action.payload.id)
    }
    const runs = new Map<string, ScriptRunnerData>(state.runs);
    return {
      ...state,
      runs,
      running: false
    };
  }

  if (Actions.ScriptRunner.notifyCompleted.test(action)) {    
    if (action.payload.id) {      
      state.runs.delete(action.payload.id)
    }
    const runs = new Map<string, ScriptRunnerData>(state.runs);
    return {
      ...state,
      runs,
      running: false
    };
  }

  return state;
}

