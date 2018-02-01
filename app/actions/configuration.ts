import { actionCreator } from './helpers';
import { IAgentConfiguration } from '../api/agent';

export const save = actionCreator<IAgentConfiguration>('configuration/SAVE');
