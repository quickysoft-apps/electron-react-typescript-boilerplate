import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { chat, ChatState } from './chat';
import { home, HomeState } from './home';
import { agent, AgentState } from './agent'

const rootReducer = combineReducers({  
  agent,
  chat,
  counter, 
  home,
  routing: routing as Reducer<any>
});

export interface State {
  home: HomeState
  chat: ChatState,
  counter: CounterState,
  agent: AgentState
} 

export default rootReducer;