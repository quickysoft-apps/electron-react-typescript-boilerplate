import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Configuration, Props } from "../components/Configuration";
import { IState } from "../reducers";
import { Actions } from "../actions";

function mapStateToProps(state: IState): Partial<Props> {
  return {
    email: state.configuration.email,
    nickname: state.configuration.nickname
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<Props> {
  return bindActionCreators(Actions.Configuration as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Configuration) as any);
