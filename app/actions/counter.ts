import { actionCreatorVoid } from './helpers';

export class Counter {
  public static readonly increment = actionCreatorVoid('INCREMENT_COUNTER');
  public static readonly decrement = actionCreatorVoid('DECREMENT_COUNTER');

 public static incrementIfOdd = function() {
  return (dispatch: Function, getState: Function) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(Counter.increment());
  };
}

public static incrementAsync = function(delay: number = 1000) {
  return (dispatch: Function) => {
    setTimeout(() => {
      dispatch(Counter.increment());
    }, delay);
  };
}
}
