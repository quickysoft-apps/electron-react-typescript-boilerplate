import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { Avatar } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
import { FloatingAction } from './FloatingAction';
import { LibraryReference } from '../actions/jobRunner';

export interface Props extends RouteComponentProps<any> {
  addReference(jobId: string): void;
  jobId: string;
  libraries: Array<LibraryReference>;
}

export class LibrariesManager extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  public add() {
    this.props.addReference(this.props.jobId);
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
            (Aucune référence)
          </p>
        </div>
      )
    }

    const listSortedItems = this.props.libraries.sort((a: LibraryReference, b: LibraryReference) => {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    const listItems = listSortedItems.map(reference => {
      return (
        <ListItem
          leftAvatar={<Avatar icon={<SvgIcons.ContentLink />} />}
          primaryText={reference.name}          
          key={reference.name}
        />
      )
    })

    return (
      <div>
        {this.props.libraries.length === 0 ? renderEmpty() : <List>{listItems}</List>}
        <FloatingAction actionclick={this.add} actionIcon={<SvgIcons.ContentAdd />} />
      </div>
    );

  }

}