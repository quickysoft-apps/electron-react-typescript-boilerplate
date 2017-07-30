import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Association, Props } from '../components/Association';
import { State } from '../reducers';
import * as Actions from '../actions/association'

function mapStateToProps(state: State): Partial<Props> {
  return {
    email: state.association.email
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(Actions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Association) as any);
