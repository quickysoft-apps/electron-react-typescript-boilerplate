import { IAction } from '../actions/helpers';
import settings = require('electron-settings');
import { Actions } from '../actions';

export interface ConfigurationState {
  email: string;
  nickname: string;
}

const initialState = {
  email: settings.get('email') as string,
  nickname: settings.get('nickname') as string
}

export function configuration(state: ConfigurationState = initialState, action: IAction) {

  if (Actions.Configuration.save.test(action)) {
    return {
      ...state,
      email: action.payload.email,
      nickname: action.payload.nickname
    };
  }

  return state;
}

