import { IAction, IActionWithPayload } from '../actions/helpers';
import { Actions } from '../actions';
import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';

interface IState {
  isVisible: boolean;
  isMenuActive: boolean;
  navigationHistory: string[];
}

export interface IAppState extends IState { }

const initialState = {
  isVisible: false,
  isMenuActive: false,
  navigationHistory: ['/']
};

export function app(state: IAppState = initialState, action: IAction): IAppState {

  if (action.type === LOCATION_CHANGE) {
    const locationChangeAction = action as LocationChangeAction;
    const newPathname = locationChangeAction.payload.pathname;
    if (state.navigationHistory.indexOf(newPathname) === -1) {
      const navigationHistory = state.navigationHistory.slice(0);
      navigationHistory.push(newPathname);
      return {
        ...state,
        navigationHistory
      };
    }
  }

  if (Actions.App.back.test(action)) {
    if (state.navigationHistory.length > 1) {
      const navigationHistory = state.navigationHistory.slice(0, state.navigationHistory.length - 1);
      return {
        ...state,
        navigationHistory
      };
    }
  }

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
    const actionWithPayload = action as IActionWithPayload<boolean>;
    return {
      ...state,
      isMenuActive: actionWithPayload.payload
    };
  }

  return state;
}
