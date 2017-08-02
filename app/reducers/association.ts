import { IAction } from '../actions/helpers';
import { Actions } from '../actions';


interface State {
  associated: boolean;
}

export interface AssociationState extends Partial<State> { }

export function association(state: AssociationState = {}, action: IAction) {

   if (Actions.Association.associate.test(action)) {
    return { 
      ...state, 
      associated: action.payload      
    };
  }  

  return state;
}

