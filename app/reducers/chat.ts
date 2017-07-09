import { IActionWithPayload } from '../actions/helpers';
import { ChatHistory } from '../model/chatHistory'
import { YakapaMessage } from '../api/yakapaClient'
import { receive } from '../actions/chat';
import { State, getInitialState } from '../model/state';

export default function chat(state: State = getInitialState(), action: IActionWithPayload<YakapaMessage>) {
  if (receive.test(action)) {    
    const chatMessage: YakapaMessage = {
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
