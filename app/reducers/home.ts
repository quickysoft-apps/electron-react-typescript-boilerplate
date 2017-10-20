import { IAction } from '../actions/helpers';

export enum AgentStatus {
  Connecting = 0,
  Connected,
  Trusted,
  Configured
}

export interface IHomeState {
  status: AgentStatus;
}

export function home(state: IHomeState = { status: AgentStatus.Connecting }, action: IAction): IHomeState {
  return state;
}
