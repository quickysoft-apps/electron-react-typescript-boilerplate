import { IAction, IActionWithPayload } from '../actions/helpers';
import { Actions } from '../actions';
import { AgentError } from '../actions/agent';

interface State {
  connected: boolean;
  connectionError: AgentError;
  socketError: AgentError;
  trusted: boolean;
  pongMs: number;
}

export interface AgentState extends Partial<State> {}

export function agent(state: AgentState = { }, action: IAction) {

  const actionWithError = action as IActionWithPayload<AgentError>;

  if (Actions.Agent.pong.test(action)) {
    return { 
      ...state, 
      pongMs: action.payload,
      socketError: undefined,
      connectionError: undefined
    };
  }  
  if (Actions.Agent.connected.test(action)) {
    return { 
      ...state, 
      connected: true,
      socketError: undefined,
      connectionError: undefined
    };
  }  
  if (Actions.Agent.authenticated.test(action)) {        
    return { 
      ...state, 
      trusted: true,
      socketError: undefined,
      connectionError: undefined
    };
  } 
  if (Actions.Agent.socketError.test(action)) {
    return { 
      ...state, 
      connected: actionWithError.payload.type === 'AuthenticationError' || actionWithError.payload.type === 'TransportError' ? false: true,
      socketError: actionWithError.payload
    };
  }  
  if (Actions.Agent.connectionError.test(action)) {
    return { 
      ...state, 
      connected: actionWithError.payload.type === 'TransportError' ? false: true,
      connectionError: actionWithError.payload 
    };
  }  
  return state;
}

