import { combineReducers, Reducer } from "redux";
import { routerReducer as routing, RouterState } from "react-router-redux";
import { counter, CounterState } from "./counter";
import { app, AppState } from "./app";
import { agent, AgentState } from "./agent";
import { chat, ChatState } from "./chat";
import { configuration, ConfigurationState } from "./configuration";
import { jobRunner, JobRunnerState } from "./jobRunner";
import { jobManager, IJobManagerState } from "./jobManager";
import { jobHistory, IJobHistoryState } from "./jobHistory";

const rootReducer:Reducer<{}> = combineReducers({
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
  agent: AgentState;
  chat: ChatState;
  configuration: ConfigurationState;
  jobRunner: JobRunnerState;
  jobManager: IJobManagerState;
  jobHistory: IJobHistoryState;
  routing: RouterState;
}

export default rootReducer;