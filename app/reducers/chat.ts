import { IActionWithPayload } from '../actions/helpers';
import { receive } from '../actions/chat';

export default function chat(state: Model.ChatHistory = new Model.ChatHistory(), action: IActionWithPayload<Model.ChatMessage>) {
  if (receive.test(action)) {    
    const chatMessage: Model.ChatMessage = {
      date: new Date(Date.now()),
      from: action.payload.from,
      message: action.payload.message
    };
    return new Model.ChatHistory(state, chatMessage);
  }

  return state;
}
