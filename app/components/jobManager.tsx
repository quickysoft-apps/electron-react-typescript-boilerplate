import { BrowserWindow } from 'electron';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import { Job } from '../actions/jobRunner';

interface State {
  jobs: Job[];
}

interface JobWindow extends Electron.BrowserWindow {
  job: Job;
}

export interface Props extends RouteComponentProps<any> {
  executeAsync: (job: Job) => void;
  stop: VoidFunction;
  running: boolean;
  script: string;
  result: any;
  error: Object;
}

export class JobRunner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    const jobs: Job[] = [];
    BrowserWindow.getAllWindows().forEach((window: JobWindow) => { jobs.push(window.job); });
    this.state = { jobs };
  }

  public render() {

    return (
      <List>
        {this.state.jobs.map((job) => {
          <ListItem
            leftAvatar={<Avatar icon={<SvgIcons.ActionAlarm />} />}
            primaryText={job.title ? job.title : job.jobId}
            secondaryText={job.cron} />
        })}
      </List>
    );
  }

}