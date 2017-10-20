import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Configuration, IProps } from '../components/Configuration';
import { IState } from '../reducers';
import { Actions } from '../actions';

function mapStateToProps(state: IState): Partial<IProps> {
  return {
    email: state.configuration.email,
    nickname: state.configuration.nickname
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators(Actions.Configuration as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Configuration) as any);
