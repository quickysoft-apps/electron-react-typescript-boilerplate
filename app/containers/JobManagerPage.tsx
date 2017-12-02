import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { JobManager, IProps } from '../components/JobManager';
import { Actions } from '../actions';
import { IState } from '../reducers';

function mapStateToProps(state: IState): Partial<IProps> {
  return {
    jobs: state.jobManager.jobs
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators(Actions.JobManager as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(JobManager) as any);
