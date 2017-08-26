import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import { Job } from '../actions/jobRunner';


export interface Props extends RouteComponentProps<any> {
  jobs: Map<string, Job>;
}

export class JobManager extends React.Component<Props> {

  constructor(props: Props) {
    super(props)    
  }

  public render() {

    return (
      <List>
        {Array.from(this.props.jobs).map(([jobId, job]) => {
          <ListItem
            leftAvatar={<Avatar icon={<SvgIcons.ActionAlarm />} />}
            primaryText={job.title ? job.title : job.jobId}
            secondaryText={job.cron} />
        })}
      </List>
    );
  }

}