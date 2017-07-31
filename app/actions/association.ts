import { actionCreator } from './helpers';

export interface AgentLink {
  email: string;  
}

export const associate = actionCreator<AgentLink>('agent/ASSOCIATE');
