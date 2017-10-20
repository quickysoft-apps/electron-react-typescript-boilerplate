import { IAction } from '../actions/helpers';
import * as settings from 'electron-settings';
import { Actions } from '../actions';

export interface IConfigurationState {
  email?: string;
  nickname?: string;
}

const initialState = {
  email: settings.get('email') as string,
  nickname: settings.get('nickname') as string
};

export function configuration(state: IConfigurationState = initialState, action: IAction): IConfigurationState {

  if (Actions.Configuration.save.test(action)) {
    return {
      email: action.payload.email,
      nickname: action.payload.nickname
    };
  }

  return state;
}
