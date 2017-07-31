import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  visible: boolean;
}

export interface AppState extends Partial<State> { }

export function app(state: AppState = { visible: false }, action: IAction) {

  if (Actions.App.hide.test(action)) {
    return {
      ...state,
      visible: false
    };
  }

  if (Actions.App.show.test(action)) {
    return {
      ...state,
      visible: true
    };
  }

  return state;
}

