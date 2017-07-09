import { ChatHistory } from './chatHistory'

export interface ChatState {
  history: ChatHistory;
}

export type CounterState = number;

export interface State {
  chat: ChatState,
  counter: CounterState
  
} 
