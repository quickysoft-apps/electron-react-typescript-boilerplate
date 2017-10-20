import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { App, IProps } from '../components/App';
import { IState } from '../reducers';
import { Actions } from '../actions';

function mapStateToProps(state: IState): Partial<IProps> {
  return {
    isVisible: state.app.isVisible,
    isMenuActive: state.app.isMenuActive,
    nickname: state.configuration.nickname,
    email: state.configuration.email ? state.configuration.email : '...',
    title: 'Agent Yakapa', // state.configuration.nickname
    navigationHistory: state.app.navigationHistory
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators({ ...routerActions, ...Actions.App } as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(App) as any);
