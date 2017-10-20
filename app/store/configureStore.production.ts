import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { listenAgentServer, agentMiddleware } from './agentMiddleware';
import rootReducer from '../reducers';
import { Store } from 'redux';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const agent = agentMiddleware();
const enhancer = applyMiddleware(thunk, router, agent);

export = {
  history,
  configureStore(initialState: object | void): Store<void | object>  {
    const store = createStore(rootReducer, initialState, enhancer);
    listenAgentServer(store);
    return store;
  }
};
