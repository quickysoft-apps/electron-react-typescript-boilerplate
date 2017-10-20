import { actionCreator } from './helpers';
import { IAgentMessage } from '../api/agent';

export const receive = actionCreator<IAgentMessage>('chat/chat/RECEIVE');
export const send = actionCreator<IAgentMessage>('chat/SEND');
