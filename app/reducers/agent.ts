import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { AgentError } from '../actions/agent';

interface State {
  connected?: boolean;
  connectionError?: AgentError;
  socketError?: AgentError;
  trusted?: boolean;
  pongMs?: number;
  connectionDate?: Date;
}

export interface AgentState extends Partial<State> { };

export function agent(state: AgentState = {}, action: IAction) {

  if (Actions.Agent.pong.test(action)) {
    return {
      ...state,
      pongMs: action.payload,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifySuccessfulConnection.test(action)) {
    return {
      ...state,
      connected: true,
      connectionDate: new Date(Date.now()),
      trusted: false,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifyReadiness.test(action)) {
    return {
      ...state,
      connected: true,
      trusted: true,      
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifySocketError.test(action)) {
    return {
      ...state,
      connected: action.payload.type === 'DiscoverError' ? false : true,
      trusted: false,
      socketError: action.payload,
      connectionError: undefined,
    };
  }

  if (Actions.Agent.notifyConnectionError.test(action)) {
    return {
      ...state,
      connected: action.payload.type === 'TransportError' ? false : true,
      trusted: false,
      socketError: undefined,
      connectionError: action.payload
    };
  }

  return state;
}

