import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
import { IJobHistory } from '../actions/jobHistory';
import { green500, red500, grey500 } from 'material-ui/styles/colors';
import { IJob } from '../actions/jobManager';

export interface IProps extends RouteComponentProps<any> {
  add: (job: IJob) => void;
  jump: (jobId: string) => void;
  jobHistories: IJobHistory[];
}

export class JobHistory extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
    moment.locale('fr');
  }

  jobItemClick(jobId: string): void {
    this.props.jump(jobId);
    this.props.history.push('/jobRunner');
  }

  public render(): JSX.Element {

    const renderEmpty = (): JSX.Element => {
      return (
        <div
          style={{
            textAlign: 'left',
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

    const listSortedItems: IJobHistory[] = this.props.jobHistories.sort((a: IJobHistory, b: IJobHistory) => {
      return (b.timestamp && a.timestamp ?
        ((a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0)) : 0);
    });

    const listItems: JSX.Element[] = listSortedItems.map(jobHistory => {
      const color = jobHistory.status.isRunning ? jobHistory.status.hasError ? red500 : green500 : grey500;
      const status = jobHistory.status.isRunning ? 'Démarré' : 'Arrêté';
      const date = moment(jobHistory.timestamp).format('ddd D MMM YYYY');
      const time = moment(jobHistory.timestamp).format('HH:mm:ss');
      const since = moment(jobHistory.timestamp).fromNow();
      return (
        <ListItem
          leftAvatar={<Avatar icon={<SvgIcons.ActionHistory />}
          color={color} />}
          primaryText={jobHistory.jobName}
          secondaryText={`${status} le ${date} à ${time} (${since})`}
          key={`${jobHistory.jobId}_${jobHistory.timestamp}`}
          onClick={this.jobItemClick.bind(this, jobHistory.jobId)}
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
