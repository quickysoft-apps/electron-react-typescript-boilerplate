import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { ScriptRunnerResult } from '../actions/scriptRunner';

export interface ScriptRunnerState {
  lastExecutionId?: string;  
  currentScript?: string;
  results: Map<string, ScriptRunnerResult>;
}

const initialState =  {
  results: new Map<string, ScriptRunnerResult>()
}

export function scriptRunner(state: ScriptRunnerState = initialState, action: IAction) {

  if (Actions.ScriptRunner.notifyExecuting.test(action)) {    
    return {
      ...state,      
      lastExecutionId: action.payload.executionId,
      currentScript: action.payload.script
    };
  }

  if (Actions.ScriptRunner.notifyExecuted.test(action)) {        
    return {
      ...state,      
      executionId: action.payload.executionId,
      result: action.payload.result,
      error: action.payload.error,      
      results: state.results.set(action.payload.executionId, action.payload)
    };
  }

  return state;
}

