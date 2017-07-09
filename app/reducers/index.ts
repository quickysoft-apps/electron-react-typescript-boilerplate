import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import chat from './chat';
import { State } from '../model/state';

const rootReducer = combineReducers<State>({
  chat: chat as Reducer<any>,  
  counter, 
  routing: routing as Reducer<any>
});

export default rootReducer;
 