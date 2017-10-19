import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing, RouterState } from 'react-router-redux';
import { counter, CounterState } from './counter';
import { app, AppState } from './app';
import { agent, IAgentState } from './agent';
import { chat, ChatState } from './chat';
import { configuration, ConfigurationState } from './configuration';
import { jobRunner, IJobRunnerState } from './jobRunner';
import { jobManager, IJobManagerState } from './jobManager';
import { jobHistory, IJobHistoryState } from './jobHistory';

const rootReducer: Reducer<{}> = combineReducers({
  app,
  agent,
  chat,
  configuration,
  jobRunner,
  jobManager,
  jobHistory,
  counter,
  routing: routing as Reducer<any>
});

export interface IState {
  counter: CounterState;
  app: AppState;
  agent: IAgentState;
  chat: ChatState;
  configuration: ConfigurationState;
  jobRunner: IJobRunnerState;
  jobManager: IJobManagerState;
  jobHistory: IJobHistoryState;
  routing: RouterState;
}

export default rootReducer;
