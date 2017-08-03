import { IAction } from '../actions/helpers';

export enum AgentStatus {
  Connecting = 0,
  Authenticated,
  Trusted,
  Associated
}

export interface HomeState {
  status: AgentStatus;
}

export function home(state: HomeState = { status: AgentStatus.Connecting }, action: IAction) {
  return state;
}
