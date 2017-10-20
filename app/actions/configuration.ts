import { actionCreator } from './helpers';

export interface IAgentConfiguration {
  email?: string;
  nickname?: string;
}

export const save = actionCreator<IAgentConfiguration>('configuration/SAVE');
