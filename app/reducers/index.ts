import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing, RouterState } from 'react-router-redux';
import { app, IAppState } from './app';
import { agent, IAgentState } from './agent';
import { chat, IChatState } from './chat';
import { configuration, IConfigurationState } from './configuration';
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
  routing: routing as Reducer<any>
});

export interface IState {
  app: IAppState;
  agent: IAgentState;
  chat: IChatState;
  configuration: IConfigurationState;
  jobRunner: IJobRunnerState;
  jobManager: IJobManagerState;
  jobHistory: IJobHistoryState;
  routing: RouterState;
}

export default rootReducer;
