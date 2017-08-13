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
    return {
      ...state,
      running: true
    };
  }

  if (Actions.ScriptRunner.notifyExecuted.test(action)) {
    return {
      ...state,
      current: { ...action.payload },
      runs: action.payload.id ? new Map<string, ScriptRunnerData>(state.runs.set(action.payload.id, action.payload)) : state.runs
    };
  }

  if (Actions.ScriptRunner.stopCurrent.test(action)) {
    if (state.current && state.current.job) {
      state.current.job.stop();
    }
    return {
      ...state,
      running: false
    };
  }

  return state;
}

