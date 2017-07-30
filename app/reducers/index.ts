import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { agent, AgentState } from './agent'
import { association, AssociationState } from './association'

const rootReducer = combineReducers({  
  agent,
  association,
  counter, 
  routing: routing as Reducer<any>
});

export interface State {
  counter: CounterState,
  agent: AgentState,
  association: AssociationState
} 

export default rootReducer;