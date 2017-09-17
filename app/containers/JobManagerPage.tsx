import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { JobManager, Props } from '../components/JobManager';
import { Actions } from '../actions';
import { State } from '../reducers'

function mapStateToProps(state: State): Partial<Props> {
  return {     
    statuses: state.jobManager.statuses
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(Actions.JobManager as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(JobManager) as any);
