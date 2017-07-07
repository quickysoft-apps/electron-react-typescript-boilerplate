import { IActionWithPayload } from '../actions/helpers';
import { ChatHistory } from '../model/chatHistory'
import { YakapaMessage } from '../api/yakapaClient'
import { receive } from '../actions/chat';

export default function chat(state: ChatHistory = new ChatHistory(), action: IActionWithPayload<YakapaMessage>) {
  if (receive.test(action)) {    
    const chatMessage: YakapaMessage = {
      date: new Date(Date.now()),
      nickname: action.payload.nickname,
      from: action.payload.from,
      message: action.payload.message
    };
    return new ChatHistory(state, chatMessage);
  }
 
  return state;
}
