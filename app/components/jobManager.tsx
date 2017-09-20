import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as uuid from 'uuid';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
import { FloatingAction } from './FloatingAction';
import { JobDefinition } from '../actions/jobRunner';
import { JobStatus } from '../actions/jobManager';
import {green500,  grey500} from 'material-ui/styles/colors';

export interface Props extends RouteComponentProps<any> {
  add: (job: JobDefinition) => void;
  select: (status: JobStatus) => void;
  statuses: Array<JobStatus>;
}

export class JobManager extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  addJob = () => {
    const jobDefinition: JobDefinition = {
      jobId: uuid.v4(),
      title: 'exemple de script',
      cron: '*/5 * * * * *',
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
      }`,
      input: null
    }
    this.props.add(jobDefinition);
    this.props.select({ jobDefinition, isRunning: false });
    this.props.history.push('/jobRunner');
  }

  public render() {

    const renderEmpty = () => {
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
      )
    }

    const listSortedItems = this.props.statuses.sort((a: JobStatus, b: JobStatus) => {
      return (a.jobDefinition.title > b.jobDefinition.title) ? 1 : ((b.jobDefinition.title > a.jobDefinition.title) ? -1 : 0);
    });
    const listItems = listSortedItems.map(status => {
      return (
        <ListItem
          leftAvatar={<Avatar icon={<SvgIcons.ActionAlarm  />} color={status.isRunning ? green500 : grey500} />}
          primaryText={status.jobDefinition.title ? status.jobDefinition.title : status.jobDefinition.jobId}
          secondaryText={status.jobDefinition.cron}
          key={status.jobDefinition.jobId}
          onClick={() => {
            this.props.select(status);
            this.props.history.push('/jobRunner');
          }} />
      )
    })

    return (
      <div>
        {this.props.statuses.length === 0 ? renderEmpty() : <List>{listItems}</List>}
        <FloatingAction actionclick={this.addJob} actionIcon={<SvgIcons.ContentAdd />} />
      </div>
    );

  }

}