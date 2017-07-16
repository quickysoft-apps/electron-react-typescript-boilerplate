import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { Counter, Props } from '../components/Counter';
import * as CounterActions from '../actions/counter';
import { State } from '../reducers'

function mapStateToProps(state: State): Partial<Props> {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(CounterActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Counter) as any as React.StatelessComponent<Props>);
