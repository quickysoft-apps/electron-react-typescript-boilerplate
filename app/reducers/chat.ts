import { IActionWithPayload } from '../actions/helpers';
import { AgentMessage } from '../api/agent'
import { Actions } from '../actions';

export interface ChatState {
  history: ChatHistory;
}

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

export function chat(state: ChatState = { history: new ChatHistory() }, action: IActionWithPayload<AgentMessage>) {
  if (Actions.Chat.receive.test(action)) {    
    const chatMessage: AgentMessage = {      
      date: new Date(Date.now()),
      nickname: action.payload.nickname,
      from: action.payload.from,
      message: action.payload.message
    };

    state.history = new ChatHistory(state.history, chatMessage);
    return state;
  }
 
  return state;
}
