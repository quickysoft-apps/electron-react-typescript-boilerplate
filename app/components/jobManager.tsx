import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as uuid from 'uuid';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
import { FloatingAction } from './FloatingAction';
import { Job } from '../actions/jobRunner';


export interface Props extends RouteComponentProps<any> {
  add: (job: Job) => void;
  jobs: Array<Job>;
}

export class JobManager extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  addJob = () => {
    const job: Job = {
      jobId: uuid.v4(),
      cron: '*/5 * * * * *',
      script: `
      //Ceci est un exemple simple de script. la méthode doit respecter la signature ci-dessous :
      async (input) => { 
        string text;
        var fileStream = new System.IO.FileStream(@"c:\logs\mylog.log", System.IO.FileMode.Open, System.IO.FileAccess.Read);
        using (var streamReader = new System.IO.StreamReader(fileStream, System.Text.Encoding.UTF8))
        {
          text = streamReader.ReadToEnd();
        }
        return text;
      }`,
      input: null
    }
    this.props.add(job);
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

    const list = () => {
      return (
        <div>
          <List>
            {Array.from(this.props.jobs).map(([jobId, job]) => {
              <ListItem
                leftAvatar={<Avatar icon={<SvgIcons.ActionAlarm />} />}
                primaryText={job.title ? job.title : job.jobId}
                secondaryText={job.cron} />
            })}
          </List>
        </div>
      )
    }

    return (
      <div>        
        {this.props.jobs.size === 0 ? renderEmpty() : list()}
        <FloatingAction actionclick={this.addJob} actionIcon={<SvgIcons.ContentAdd />} />
      </div>
    );

  }

}