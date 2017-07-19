import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { YakapaClientError } from '../actions/yakapaClient';

interface State {
  connected: boolean;
  connectionError: YakapaClientError;
  socketError: YakapaClientError;
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
      connected: action.payload.type === 'AuthenticationError' || action.payload.type === 'TransportError' ? false: true,
      socketError: action.payload
    };
  }  
  if (Actions.YakapaClient.connectionError.test(action)) {
    return { 
      ...state, 
      connected: action.payload.type === 'TransportError' ? false: true,
      connectionError: action.payload 
    };
  }  
  return state;
}

