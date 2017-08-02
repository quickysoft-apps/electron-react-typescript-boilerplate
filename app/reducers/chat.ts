import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
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
  chat: ChatHistory;
}

export interface ChatState extends Partial<State> { }

export function chat(state: ChatState = {}, action: IAction) {
  
  if (Actions.Chat.receive.test(action)) {    
    const chatMessage: AgentMessage = {      
      date: new Date(Date.now()),
      nickname: action.payload.nickname,
      from: action.payload.from,
      to: action.payload.to,
      message: action.payload.message
    };

    state.chat = new ChatHistory(state.chat, chatMessage);
    return state;
  }

  return state;
}

