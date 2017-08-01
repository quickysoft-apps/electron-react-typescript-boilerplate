import { actionCreator } from './helpers';

export interface AssociationData {
  email: string;
  nickname: string;
}

export const setEmail = actionCreator<string>('association/SET_EMAIL');
export const setNickname = actionCreator<string>('association/SET_NICKNAME');
export const associate = actionCreator<AssociationData>('association/ASSOCIATE');
