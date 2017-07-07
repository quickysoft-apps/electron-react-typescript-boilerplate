import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { yakapaClientMiddleware } from './yakapaClientMiddleware';
import rootReducer from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const yakapaClient = yakapaClientMiddleware();
const enhancer = applyMiddleware(thunk, router, yakapaClient);

export = {
  history,
  configureStore(initialState: Object | void) {
    return createStore(rootReducer, initialState, enhancer);
  }
};
