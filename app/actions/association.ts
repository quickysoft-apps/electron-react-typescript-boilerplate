import { actionCreator } from './helpers';

export interface AgentLink {
  email: string;  
}

export class Association {
  public static readonly associate = actionCreator<AgentLink>('agent/ASSOCIATE');
}