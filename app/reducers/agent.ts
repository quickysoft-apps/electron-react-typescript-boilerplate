import { IAction } from '../actions/helpers';
import settings = require('electron-settings');
import { Actions } from '../actions';
import { AgentError, AgentProfile } from '../actions/agent';

interface State {
  connected?: boolean;
  connectionError?: AgentError;
  socketError?: AgentError;
  trusted?: boolean;
  pongMs?: number;
  profile: AgentProfile;
}

export type AgentState = State;

const initialState = { 
  profile: { 
    email: settings.get('email') as string
  }
} 

export function agent(state: AgentState = initialState, action: IAction) {

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
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifySuccessfulAuthentication.test(action)) {
    return {
      ...state,
      trusted: true,
      socketError: undefined,
      connectionError: undefined,
      profile: {
        ...state.profile, 
        nickname: action.payload.nickname
      }
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

  if (Actions.Agent.setProfile.test(action)) {
    return {
      ...state,
      profile: {
        email: action.payload.email,
        nickname: action.payload.nickname
      }
    };
  }

  return state;
}

