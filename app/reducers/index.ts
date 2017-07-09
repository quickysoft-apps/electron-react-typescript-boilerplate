import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import chat from './chat';

const rootReducer = combineReducers({
  chat: chat as Reducer<any>,  
  counter, 
  routing: routing as Reducer<any>
});

export default rootReducer;
 