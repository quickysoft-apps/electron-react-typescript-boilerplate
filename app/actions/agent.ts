import { actionCreator, actionCreatorVoid } from './helpers';
import { AgentMessage } from '../api/agent';

export interface AgentError extends Partial<Error> {
  type?: string;
}

export const connected = actionCreatorVoid('agent/CONNECTED');
export const connectionError = actionCreator<AgentError>('agent/CONNECTION_ERROR');
export const socketError = actionCreator<AgentError>('agent/SOCKET_ERROR');
export const authenticated = actionCreator<AgentMessage>('agent/AUTHENTICATED');
export const pong = actionCreator<number>('agent/PONG');
export const chatReceive = actionCreator<AgentMessage>('agent/CHAT_RECEIVE');
export const chatSend = actionCreator<AgentMessage>('agent/CHAT_SEND');  
