import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { Counter, IProps } from '../components/Counter';
import * as CounterActions from '../actions/counter';
import { State } from '../model/state';

function mapStateToProps(state: State): Partial<IProps> {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<IProps> {
  return bindActionCreators(CounterActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Counter) as any as React.StatelessComponent<IProps>);
