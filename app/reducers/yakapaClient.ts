import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  connected: boolean;
  connectionError: Error;
  socketError: Error;
  trusted: boolean;
}

export interface YakapaClientState extends Partial<State> {}

export function yakapaClient(state: YakapaClientState = { }, action: IAction) {
  if (Actions.YakapaClient.connected.test(action)) {
    return { 
      ...state, 
      connected: true,
      socketError: undefined,
      connectionError: undefined
    };
  }  
  if (Actions.YakapaClient.authenticated.test(action)) {        
    return { 
      ...state, 
      trusted: true,
      socketError: undefined,
      connectionError: undefined
    };
  } 
  if (Actions.YakapaClient.socketError.test(action)) {
    return { 
      ...state, 
      connected: action.payload.message === 'xhr poll error' ? false: true,
      socketError: action.payload
    };
  }  
  if (Actions.YakapaClient.connectionError.test(action)) {
    return { 
      ...state, 
      connected: action.payload.message === 'xhr poll error' ? false: true,
      connectionError: action.payload 
    };
  }  
  return state;
}

