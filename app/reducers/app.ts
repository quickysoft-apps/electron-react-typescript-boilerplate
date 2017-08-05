import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  isVisible: boolean;
  isMenuActive: boolean;
}

export interface AppState extends Partial<State> { }

const initialState = {
  isVisible: false,
  isMenuActive: false
};

export function app(state: AppState = initialState, action: IAction) {

  if (Actions.App.hide.test(action)) {
    return {
      ...state,
      isVisible: false,
      isMenuActive: false
    };
  }

  if (Actions.App.show.test(action)) {
    return {
      ...state,
      isVisible: true,
      isMenuActive: false
    };
  }

  if (Actions.App.toggleMenu.test(action)) {
    return {
      ...state,
      isMenuActive: action.payload
    };
  }

  return state;
}

