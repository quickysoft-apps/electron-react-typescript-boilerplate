import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { JobRunner, IProps } from '../components/JobRunner';
import { Actions } from '../actions';
import { IState } from '../reducers';

function mapStateToProps(state: IState): Partial<IProps> {
  return {
    job: state.jobRunner.job,
    result: state.jobRunner.result,
    scriptError: state.jobRunner.scriptError
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators({ ...Actions.JobRunner, ...Actions.JobHistory } as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(JobRunner) as any);
