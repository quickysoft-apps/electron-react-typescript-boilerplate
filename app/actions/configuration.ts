import { actionCreator } from './helpers';

export interface AgentConfiguration {
  email?: string;
  nickname?: string;
}

export const save = actionCreator<AgentConfiguration>('configuration/SAVE');

