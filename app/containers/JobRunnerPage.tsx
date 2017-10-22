import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { JobRunner, IProps } from '../components/JobRunner';
import { Actions } from '../actions';
import { IState } from '../reducers';

function mapStateToProps(state: IState): Partial<IProps> {
  return {
    jobId: state.jobRunner.jobId,
    isRunning: state.jobRunner.isRunning,
    cron: state.jobRunner.cron,
    script: state.jobRunner.script,
    result: state.jobRunner.result,
    scriptError: state.jobRunner.scriptError,
    title: state.jobRunner.title,
    input: state.jobRunner.input,
    libraries: state.jobRunner.libraries
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators(Actions.JobRunner as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(JobRunner) as any);
