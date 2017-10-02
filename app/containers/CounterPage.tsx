import * as React from "react";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { Counter, Props } from "../components/Counter";
import { Actions } from "../actions";
import { IState } from "../reducers";

function mapStateToProps(state: IState): Partial<Props> {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<Props> {
  return bindActionCreators(Actions.Counter as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(Counter) as any as React.StatelessComponent<Props>);
