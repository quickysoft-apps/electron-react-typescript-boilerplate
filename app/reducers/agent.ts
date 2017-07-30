import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { AgentError } from '../actions/agent';
import { AgentMessage } from '../api/agent'

export class ChatHistory {

  readonly history: Set<AgentMessage> = new Set<AgentMessage>();

  constructor(chatHistory?: ChatHistory, chatMessage?: AgentMessage) {
    if (chatHistory !== undefined) {
      this.history = new Set<AgentMessage>(chatHistory.history);
    }
    if (chatMessage !== undefined) {
      this.history.add(chatMessage);
    }
  }

}

interface State {
  connected: boolean;
  connectionError: AgentError;
  socketError: AgentError;
  trusted: boolean;
  pongMs: number;
  chat: ChatHistory;
}

export interface AgentState extends Partial<State> { }

export function agent(state: AgentState = {}, action: IAction) {

  if (Actions.Agent.pong.test(action)) {
    return {
      ...state,
      pongMs: action.payload,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.connected.test(action)) {
    return {
      ...state,
      connected: true,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.authenticated.test(action)) {
    return {
      ...state,
      trusted: true,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.socketError.test(action)) {
    return {
      ...state,
      connected: action.payload.type === 'AuthenticationError' || action.payload.type === 'TransportError' ? false : true,
      socketError: action.payload
    };
  }

  if (Actions.Agent.connectionError.test(action)) {
    return {
      ...state,
      connected: action.payload.type === 'TransportError' ? false : true,
      connectionError: action.payload
    };
  }

  if (Actions.Agent.chatReceive.test(action)) {    
    const chatMessage: AgentMessage = {      
      date: new Date(Date.now()),
      nickname: action.payload.nickname,
      from: action.payload.from,
      message: action.payload.message
    };

    state.chat = new ChatHistory(state.chat, chatMessage);
    return state;
  }

  return state;
}

