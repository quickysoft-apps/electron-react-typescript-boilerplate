import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { chat, ChatState } from './chat';
import { home, HomeState } from './home';
import { yakapaClient, YakapaClientState } from './yakapaClient'

const rootReducer = combineReducers({
  yakapaClient,
  chat,
  counter, 
  home,
  routing: routing as Reducer<any>
});

export interface State {
  home: HomeState
  chat: ChatState,
  counter: CounterState,
  yakapaClient: YakapaClientState
} 

export default rootReducer;