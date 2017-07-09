import { IAction } from '../actions/helpers';
import { increment, decrement } from '../actions/counter';
import { State, getInitialState } from '../model/state';

export default function counter(state: State = getInitialState() , action: IAction) {
  if (increment.test(action)) {
    return state.counter + 1;
  } else if (decrement.test(action)) {
    return state.counter - 1;
  }

  return state;
}
