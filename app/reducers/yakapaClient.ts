import { IActionWithPayload } from '../actions/helpers';
import { YakapaMessage } from '../api/yakapaClient'
import { Actions } from '../actions';

export interface YakapaClientState {
  connected: boolean;
  connectionError: boolean;
  authenticated: boolean;
}

export function yakapaClient(state: YakapaClientState = { connected: false, connectionError: false, authenticated: false }, action: IActionWithPayload<YakapaMessage>) {
  if (Actions.YakapaClient.connected.test(action)) {
    return { ...state, connected: true };
  }
  if (Actions.YakapaClient.connectionError.test(action)) {
    return { ...state, connectionError: true };
  }
  if (Actions.YakapaClient.authenticated.test(action)) {        
    return { ...state, authenticated: true};
  } 
  return state;
}
