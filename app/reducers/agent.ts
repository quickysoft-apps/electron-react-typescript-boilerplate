import { IAction, IActionWithPayload } from '../actions/helpers';
import { Actions } from '../actions';
import { IAgentError } from '../actions/agent';

export interface IAgentState {
  connected?: boolean;
  connectionError?: IAgentError;
  socketError?: IAgentError;
  trusted?: boolean;
  pongMs?: number;
  connectionDate?: Date;
}

export function agent(state: IAgentState = {}, action: IAction) {

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
    const actionWithPayload = action as IActionWithPayload<IAgentError>;
    return {
      ...state,
      connected: actionWithPayload.payload.type === 'DiscoverError' ? false : true,
      trusted: false,
      socketError: actionWithPayload.payload,
      connectionError: undefined,
    };
  }

  if (Actions.Agent.notifyConnectionError.test(action)) {
    const actionWithPayload = action as IActionWithPayload<IAgentError>;
    return {
      ...state,
      connected: actionWithPayload.payload.type === 'TransportError' ? false : true,
      trusted: false,
      socketError: undefined,
      connectionError: actionWithPayload.payload
    };
  }

  return state;
}
