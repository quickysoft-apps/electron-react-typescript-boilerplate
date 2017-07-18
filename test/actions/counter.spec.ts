import { spy } from 'sinon';
import { Actions } from '../../app/actions';

describe('actions', () => {
  it('should increment should create increment action', () => {
    expect(Actions.Counter.increment()).toMatchSnapshot();
  });

  it('should decrement should create decrement action', () => {
    expect(Actions.Counter.decrement()).toMatchSnapshot();
  });

  it('should incrementIfOdd should create increment action', () => {
    const fn = Actions.Counter.incrementIfOdd();
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    const getState = () => ({ counter: 1 });
    fn(dispatch, getState);
    expect(dispatch.calledWith({ type: Actions.Counter.increment.type })).toBe(true);
  });

  it('should incrementIfOdd shouldnt create increment action if counter is even', () => {
    const fn = Actions.Counter.incrementIfOdd();
    const dispatch = spy();
    const getState = () => ({ counter: 2 });
    fn(dispatch, getState);
    expect(dispatch.called).toBe(false);
  });

  // There's no nice way to test this at the moment...
  it('should incrementAsync', done => {
    const fn = Actions.Counter.incrementAsync(1);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
    setTimeout(() => {
      expect(dispatch.calledWith({ type: Actions.Counter.increment.type })).toBe(true);
      done();
    }, 5);
  });
});
