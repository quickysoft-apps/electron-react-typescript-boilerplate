import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { App, Props } from '../components/App';
import { State } from '../reducers';
import { Actions } from '../actions'

function mapStateToProps(state: State): Partial<Props> {
  return {
    visible: state.app.visible,
    location: state.routing.location,    
    title: state.configuration.nickname
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators({...routerActions, ...Actions.App} as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(App) as any);
