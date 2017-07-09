import { ChatHistory } from './chatHistory'

export interface State {
  counter: number;
  chat: ChatHistory;
}

export function getInitialState() {
  return {
    counter: 0,
    chat: new ChatHistory()
  }
}
