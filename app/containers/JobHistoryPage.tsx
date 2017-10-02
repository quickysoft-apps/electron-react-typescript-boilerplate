import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { JobHistory, IProps } from "../components/JobHistory";
import { Actions } from "../actions";
import { IState } from "../reducers";

function mapStateToProps(state: IState): Partial<IProps> {
  return {
    jobHistories: state.jobHistory.jobHistories
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators(Actions.JobHistory as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(JobHistory) as any);
