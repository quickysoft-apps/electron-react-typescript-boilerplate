import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Home, Props } from '../components/Home';
import { AgentStatus } from '../reducers/home';
import { State } from '../reducers';
import * as agentActions from '../actions/agent';

function mapStateToProps(state: State): Partial<Props> {

  let status = AgentStatus.Asleep;

  if (state.agent.connected === true) {
    status = AgentStatus.Alive;
    if (state.agent.trusted === true) {
      status = AgentStatus.Trusted;
    }
  }

  return {
    status,    
    trusted: state.agent.trusted,
    pongMs: state.agent.pongMs
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(agentActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Home) as any as React.StatelessComponent<Props>);
