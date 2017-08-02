import { IAction } from '../actions/helpers';

export enum AgentStatus {
  Dead = 0,
  Sick,
  Alive
}

export interface HomeState {
  status: AgentStatus;
}

export function home(state: HomeState = { status: AgentStatus.Dead }, action: IAction) {
  return state;
}
