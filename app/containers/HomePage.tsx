import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import { Home, Props } from '../components/Home';
import { AgentStatus } from '../reducers/home';
import { State } from '../reducers';
import { Actions } from '../actions';

function mapStateToProps(state: State): Partial<Props> {

  moment.locale('fr');

  let status = AgentStatus.Connecting;

  if (state.agent.connected === true) {
    status = AgentStatus.Connected;
  }

  if (state.agent.trusted === true) {
    status = AgentStatus.Trusted;
  }

  return {
    status,
    isTrusted: state.agent.trusted,
    isConnected: state.agent.connected,
    pongMs: state.agent.pongMs ? state.agent.pongMs : 0,    
    connectedSince: moment(state.agent.connectionDate).fromNow(),
    isConfigured: !!state.configuration.email,
    nickname: state.configuration.nickname,
    email: state.configuration.email    
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(Actions.Agent as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Home) as any);
