import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing, RouterState } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { app, AppState } from './app'
import { agent, AgentState } from './agent'
import { chat, ChatState } from './chat'
import { configuration, ConfigurationState } from './configuration'

const rootReducer = combineReducers({  
  app,
  agent,  
  chat,
  configuration,
  counter, 
  routing: routing as Reducer<any>
});

export interface State {
  counter: CounterState,
  app: AppState,
  agent: AgentState,
  chat: ChatState,
  configuration: ConfigurationState,
  routing: RouterState
} 

export default rootReducer;