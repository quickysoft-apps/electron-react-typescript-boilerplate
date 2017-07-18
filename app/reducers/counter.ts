import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

export type CounterState = number;

export function counter(state: CounterState = 0, action: IAction) {
  if (Actions.Counter.increment.test(action)) {
    return state + 1;
  } else if (Actions.Counter.decrement.test(action)) {
    return state - 1;
  }

  return state;
}
