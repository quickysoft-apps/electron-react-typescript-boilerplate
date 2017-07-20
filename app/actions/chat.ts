import { actionCreator } from './helpers';
import { AgentMessage } from '../api/agent';

export class Chat {
  public static readonly receive = actionCreator<AgentMessage>('chat/RECEIVE');
  public static readonly send = actionCreator<AgentMessage>('chat/SEND');
}