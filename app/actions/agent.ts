import { actionCreator, actionCreatorVoid } from './helpers';
import { AgentMessage } from '../api/agent';

export interface AgentError extends Partial<Error> {
  type?: string;
}

export interface AgentProfile {
  email?: string;
  nickname?: string;
}

export const notifySuccessfulConnection = actionCreatorVoid('agent/NOTIFY_SUCCESSFUL_CONNECTION');
export const notifyConnectionError = actionCreator<AgentError>('agent/NOTIFY_CONNECTION_ERROR');
export const notifySocketError = actionCreator<AgentError>('agent/NOTIFY_SOCKET_ERROR');
export const notifySuccessfulAuthentication = actionCreator<AgentMessage>('agent/NOTIFY_SUCCESSFUL_AUTHENTICATION');
export const pong = actionCreator<number>('agent/PONG');


export const setProfile = actionCreator<AgentProfile>('agent/SET_PROFILE');