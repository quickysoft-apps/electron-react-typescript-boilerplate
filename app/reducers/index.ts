import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { app, AppState } from './app'
import { agent, AgentState } from './agent'
import { chat, ChatState } from './chat'
import { association, AssociationState } from './association'

const rootReducer = combineReducers({  
  app,
  agent,  
  chat,
  association,
  counter, 
  routing: routing as Reducer<any>
});

export interface State {
  counter: CounterState,
  app: AppState,
  agent: AgentState,
  chat: ChatState,
  association: AssociationState
} 

export default rootReducer;