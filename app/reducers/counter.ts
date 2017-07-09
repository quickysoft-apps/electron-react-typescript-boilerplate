import { IAction } from '../actions/helpers';
import { increment, decrement } from '../actions/counter';
import { CounterState } from '../model/state';

export default function counter(state: CounterState = 0, action: IAction) {
  if (increment.test(action)) {
    return state + 1;
  } else if (decrement.test(action)) {
    return state - 1;
  }

  return state;
}
