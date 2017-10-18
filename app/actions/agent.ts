import { actionCreator, actionCreatorVoid } from './helpers';
import { AgentMessage } from '../api/agent';

export interface IAgentError extends Partial<Error> {
  type?: string;
}

export const notifySuccessfulConnection = actionCreatorVoid('agent/NOTIFY_SUCCESSFUL_CONNECTION');
export const notifyConnectionError = actionCreator<IAgentError>('agent/NOTIFY_CONNECTION_ERROR');
export const notifySocketError = actionCreator<IAgentError>('agent/NOTIFY_SOCKET_ERROR');
export const notifyReadiness = actionCreator<AgentMessage>('agent/NOTIFY_READINESS');
export const pong = actionCreator<number>('agent/PONG');
