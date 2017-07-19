import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Home, Props } from '../components/Home';
import { AgentStatus } from '../reducers/home';
import { State } from '../reducers';
import * as HomeActions from '../actions/home';

function mapStateToProps(state: State): Partial<Props> {

  let status = AgentStatus.Asleep;

  if (state.yakapaClient.connected === true) {
    status = AgentStatus.Alive;
    if (state.yakapaClient.trusted === true) {
      status = AgentStatus.Trusted;
    }
  }

  return {
    status,
    trusted: state.yakapaClient.trusted
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(HomeActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Home) as any as React.StatelessComponent<Props>);
