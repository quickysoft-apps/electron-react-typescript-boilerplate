import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Home, Props } from '../components/Home';
import { AgentStatus } from '../reducers/home';
import { State } from '../reducers';
import { Actions } from '../actions';

function mapStateToProps(state: State): Partial<Props> {

  let status = AgentStatus.Connecting;

  if (state.agent.connected === true) {
    status = AgentStatus.Connected;
  }

  if (state.agent.trusted === true) {
    status = AgentStatus.Trusted;
  }

  return {
    status,
    visible: state.app.visible,
    isTrusted: state.agent.trusted,
    isConnected: state.agent.connected,
    pongMs: state.agent.pongMs
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(Actions.Agent as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Home) as any);
