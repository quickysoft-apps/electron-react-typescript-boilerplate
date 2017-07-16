import { IAction } from '../actions/helpers';
import { increment, decrement } from '../actions/counter';

export type CounterState = number;

export function counter(state: CounterState = 0, action: IAction) {
  if (increment.test(action)) {
    return state + 1;
  } else if (decrement.test(action)) {
    return state - 1;
  }

  return state;
}
