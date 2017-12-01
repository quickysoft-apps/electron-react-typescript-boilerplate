import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as uuid from 'uuid';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
import { FloatingAction } from './FloatingAction';
import { IJobDefinition, ILibraryReference } from '../actions/jobRunner';
import { IJobStatus } from '../actions/jobManager';
import { green500, red500, grey500 } from 'material-ui/styles/colors';

export interface IProps extends RouteComponentProps<any> {
  add: (job: IJobDefinition) => void;
  select: (jobDefinition: IJobDefinition) => void;
  statuses: IJobStatus[];
}

export class JobManager extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  jobItemClick(jobDefinition: IJobDefinition): void {
    this.props.select(jobDefinition);
    this.props.history.push('/jobRunner');
  }

  addJob = (): void => {
    const jobDefinition: IJobDefinition = {
      jobId: uuid.v4(),
      name: 'nouveau_script',
      cron: '*/5 * * * * *',
      input: undefined,
      libraries: new Array<ILibraryReference>(),
      script: `
      //Ceci est un exemple simple de script.
      //la méthode doit respecter la signature ci-dessous :
      async (input) => {
        /*
        string text;
        var fileStream = new System.IO.FileStream(
          @"c:\\logs\\mylog.log",
          System.IO.FileMode.Open,
          System.IO.FileAccess.Read
        );
        using (
          var streamReader = new System.IO.StreamReader(
            fileStream,
            System.Text.Encoding.UTF8
        ))
        {
          text = streamReader.ReadToEnd();
        }
        return text;
        */
      }`
    };
    this.props.add(jobDefinition);
    this.props.select(jobDefinition);
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

    const listSortedItems = this.props.statuses.sort((a: IJobStatus, b: IJobStatus) => {
      return (a.jobName > b.jobName) ? 1 : ((b.jobName > a.jobName) ? -1 : 0);
    });
    const listItems = listSortedItems.map(status => {
      return (
        <ListItem
          leftAvatar={<Avatar icon={<SvgIcons.ActionAlarm />} color={status.hasError ? red500 : status.isRunning ? green500 : grey500} />}
          primaryText={status.jobName ? status.jobName : status.jobId}
          secondaryText={status.jobId}
          key={status.jobId}
          onClick={this.jobItemClick.bind(this, status)} />
      );
    });

    return (
      <div>
        {this.props.statuses.length === 0 ? renderEmpty() : <List>{listItems}</List>}
        <FloatingAction onClick={this.addJob} actionIcon={<SvgIcons.ContentAdd />} />
      </div>
    );

  }

}
