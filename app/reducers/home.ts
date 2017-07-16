import { IAction } from '../actions/helpers';

export enum AgentStatus {
  Asleep = 0,
  Alive,
  Trusted
}

export interface HomeState {
  status: AgentStatus;
}

export function home(state: HomeState = { status: AgentStatus.Asleep }, action: IAction) {
  return state;
}
