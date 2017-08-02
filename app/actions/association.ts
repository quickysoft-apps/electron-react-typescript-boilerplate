import { actionCreator } from './helpers';

export interface AssociationData {
    associate: boolean;
}

export const associate = actionCreator<boolean>('association/ASSOCIATE');

