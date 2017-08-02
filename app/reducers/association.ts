import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  associate: boolean;
}

export interface AssociationState extends Partial<State> { }

export function association(state: AssociationState = {}, action: IAction) {

   if (Actions.Association.associate.test(action)) {
    return { 
      ...state, 
      associate: action.payload
    };
  }  

  return state;
}

