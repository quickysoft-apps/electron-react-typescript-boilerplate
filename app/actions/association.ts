import { actionCreator } from './helpers';

export interface AssociationData {
  email: string;
  nickname: string;
}

export const associate = actionCreator<AssociationData>('association/ASSOCIATE');
