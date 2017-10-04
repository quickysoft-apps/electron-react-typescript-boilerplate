import * as React from "react";
import { RouteComponentProps } from "react-router";
import { List, ListItem } from "material-ui/List";
import { Avatar } from "material-ui";
import * as SvgIcons from "material-ui/svg-icons";
import * as Colors from "material-ui/styles/colors";
import { IJobDefinition } from "../actions/jobRunner";
import { IJobHistory } from "../actions/jobHistory";
import { green500, red500 } from "material-ui/styles/colors";

export interface IProps extends RouteComponentProps<any> {
  add: (job: IJobDefinition) => void;
  jobHistories: Array<IJobHistory>;
}

export class JobHistory extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  public render():JSX.Element {

    // tslint:disable-next-line:typedef
    const renderEmpty = () => {
      return (
        <div
          style={{
            textAlign: "left",
            margin: 16
          }}>
          <p style={{
            color: Colors.grey700
          }}>
            Il n'y a aucun élément historique pour le moment.
          </p>
        </div>
      );
    };

    const listSortedItems:IJobHistory[] = this.props.jobHistories.sort((a: IJobHistory, b: IJobHistory) => {
      return (b.scheduledTime && a.scheduledTime ?
                  ((a.scheduledTime > b.scheduledTime) ? 1 : ((b.scheduledTime > a.scheduledTime) ? -1 : 0)) : 0);
    });

    const listItems:JSX.Element[] = listSortedItems.map(jobHistory => {
      return (
        <ListItem
        leftAvatar={<Avatar icon={<SvgIcons.ActionHistory />} color={jobHistory.status.hasError ? red500 : green500} />}
         primaryText={jobHistory.status.jobDefinition.title}
          key={jobHistory.status.jobDefinition.jobId}
          />
      );
    });

    return (
      <div>
        {this.props.jobHistories.length === 0 ? renderEmpty() : <List>{listItems}</List>}
      </div>
    );

  }

}