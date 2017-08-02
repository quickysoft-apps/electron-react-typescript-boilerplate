import { actionCreator } from './helpers';
import { AgentMessage } from '../api/agent';

export const receive = actionCreator<AgentMessage>('chat/chat/RECEIVE');
export const send = actionCreator<AgentMessage>('chat/SEND');  

