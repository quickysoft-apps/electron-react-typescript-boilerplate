import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  connected: boolean;
  connectionError: Object;
  socketError: Error;
  trusted: boolean;
}

export interface YakapaClientState extends Partial<State> {}

export function yakapaClient(state: YakapaClientState = { }, action: IAction) {
  if (Actions.YakapaClient.connected.test(action)) {
    return { ...state, connected: true };
  }  
  if (Actions.YakapaClient.authenticated.test(action)) {        
    return { ...state, trusted: true};
  } 
  if (Actions.YakapaClient.socketError.test(action)) {
    return { ...state, socketError: action.payload };
  }  
  if (Actions.YakapaClient.connectionError.test(action)) {
    return { ...state, connectionError: action.payload };
  }  
  return state;
}

