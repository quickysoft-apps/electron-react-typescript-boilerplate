import { actionCreator, actionCreatorVoid } from './helpers';
import { AgentMessage } from '../api/agent';

export interface AgentError extends Partial<Error> {
  type?: string;
}

export interface AgentLink {
  email: string;
  
}

export class Agent {
  public static readonly connected = actionCreatorVoid('agent/CONNECTED');
  public static readonly connectionError = actionCreator<AgentError>('agent/CONNECTION_ERROR');
  public static readonly socketError = actionCreator<AgentError>('agent/SOCKET_ERROR');
  public static readonly authenticated = actionCreator<AgentMessage>('agent/AUTHENTICATED');  
  public static readonly pong = actionCreator<number>('agent/PONG');  
}