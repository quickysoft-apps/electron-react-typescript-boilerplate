import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

interface State {
  email: string;
  nickname: string;
}

export interface AssociationState extends Partial<State> {}

export function association(state: AssociationState = { }, action: IAction) {

  if (Actions.Association.setEmail.test(action)) {
    return { 
      ...state, 
      email: action.payload
    };
  }  

  if (Actions.Association.setNickname.test(action)) {
    return { 
      ...state, 
      nickname: action.payload
    };
  }  
 
  return state;
}

