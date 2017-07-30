import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  email: string;
}

export interface AssociationState extends Partial<State> {}

export function association(state: AssociationState = { }, action: IAction) {

  if (Actions.Association.associate.test(action)) {
    return { 
      ...state, 
      email: action.payload.email
    };
  }  
 
  return state;
}

