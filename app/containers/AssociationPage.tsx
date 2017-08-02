import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Association, Props } from '../components/Association';
import { State } from '../reducers';
import { Actions } from '../actions'

function mapStateToProps(state: State): Partial<Props> {
  return {
    email: state.agent.email,
    nickname: state.agent.nickname
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators({...Actions.Association, ...Actions.Agent} as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Association) as any);
