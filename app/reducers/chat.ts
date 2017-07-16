import { IActionWithPayload } from '../actions/helpers';
import { YakapaMessage } from '../api/yakapaClient'
import { receive } from '../actions/chat';

export interface ChatState {
  history: ChatHistory;
}

export class ChatHistory {

  readonly history: Set<YakapaMessage> = new Set<YakapaMessage>();

  constructor(chatHistory?: ChatHistory, chatMessage?: YakapaMessage) {
    if (chatHistory !== undefined) {
      this.history = new Set<YakapaMessage>(chatHistory.history);
    }
    if (chatMessage !== undefined) {
      this.history.add(chatMessage);
    }
  }

}

export function chat(state: ChatState = { history: new ChatHistory() }, action: IActionWithPayload<YakapaMessage>) {
  if (receive.test(action)) {    
    const chatMessage: YakapaMessage = {
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
