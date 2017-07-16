import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { chat, ChatState } from './chat';
import { home, HomeState } from './home';

const rootReducer = combineReducers({
  chat: chat,  
  counter, 
  home,
  routing: routing as Reducer<any>
});

export interface State {
  home: HomeState
  chat: ChatState,
  counter: CounterState
} 

export default rootReducer;