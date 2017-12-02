import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
import { FloatingAction } from './FloatingAction';
import { IJob, Job } from '../actions/jobManager';
import { green500, red500, grey500 } from 'material-ui/styles/colors';

export interface IProps extends RouteComponentProps<any> {
  add: (job: IJob) => void;
  select: (job: IJob) => void;
  jobs: IJob[];
}

export class JobManager extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  jobItemClick(job: IJob): void {
    this.props.select(job);
    this.props.history.push('/jobRunner');
  }

  addJob = (): void => {
    const job = new Job();
    this.props.add(job);
    this.props.select(job);
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
            Il n'y a aucune tâche active pour le moment.
          </p>
        </div>
      );
    };

    const listSortedItems = this.props.jobs.sort((a: IJob, b: IJob) => {
      return (a.definition.name > b.definition.name) ? 1 : ((b.definition.name > a.definition.name) ? -1 : 0);
    });
    const listItems = listSortedItems.map(job => {
      return (
        <ListItem
          leftAvatar={<Avatar icon={<SvgIcons.ActionAlarm />}
          color={job.status.hasError ? red500 : job.status.isRunning ? green500 : grey500} />}
          primaryText={job.definition.name ? job.definition.name : job.id}
          secondaryText={job.definition.cron}
          key={job.id}
          onClick={this.jobItemClick.bind(this, job)} />
      );
    });

    return (
      <div>
        {this.props.jobs.length === 0 ? renderEmpty() : <List>{listItems}</List>}
        <FloatingAction onClick={this.addJob} actionIcon={<SvgIcons.ContentAdd />} />
      </div>
    );

  }

}
