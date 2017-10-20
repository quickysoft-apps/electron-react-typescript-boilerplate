import { IAction } from '../actions/helpers';
import { Actions } from '../actions';
import { IAgentMessage } from '../api/agent';

export class ChatHistory {

  readonly history: Set<IAgentMessage> = new Set<IAgentMessage>();

  constructor(chatHistory?: ChatHistory, chatMessage?: IAgentMessage) {
    if (chatHistory !== undefined) {
      this.history = new Set<IAgentMessage>(chatHistory.history);
    }
    if (chatMessage !== undefined) {
      this.history.add(chatMessage);
    }
  }

}

interface IState {
  chat: ChatHistory;
}

export interface IChatState extends Partial<IState> { }

export function chat(state: IChatState = {}, action: IAction): IChatState {

  if (Actions.Chat.receive.test(action)) {
    const chatMessage: IAgentMessage = {
      date: new Date(Date.now()),
      nickname: action.payload.nickname,
      from: action.payload.from,
      to: action.payload.to,
      email: action.payload.email,
      message: action.payload.message
    };

    state.chat = new ChatHistory(state.chat, chatMessage);
    return state;
  }

  return state;
}
