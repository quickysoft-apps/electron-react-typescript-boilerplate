import * as React from "react";
import { RouteComponentProps } from "react-router";
import { List, ListItem } from "material-ui/List";
import { Avatar } from "material-ui";
import * as SvgIcons from "material-ui/svg-icons";
import * as Colors from "material-ui/styles/colors";
import { FloatingAction } from "./FloatingAction";
import { ILibraryReference } from "../actions/jobRunner";

export interface IProps extends RouteComponentProps<any> {
  addReference(jobId: string): void;
  jobId: string;
  libraries: Array<ILibraryReference>;
}

export class LibrariesManager extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  public add():void {
    this.props.addReference(this.props.jobId);
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
            (Aucune référence)
          </p>
        </div>
      );
    };

    const listSortedItems:ILibraryReference[] = this.props.libraries.sort((a: ILibraryReference, b: ILibraryReference) => {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    const listItems:JSX.Element[] = listSortedItems.map(reference => {
      return (
        <ListItem
          leftAvatar={<Avatar icon={<SvgIcons.ContentLink />} />}
          primaryText={reference.name}
          key={reference.name}
        />
      );
    });

    return (
      <div>
        {this.props.libraries.length === 0 ? renderEmpty() : <List>{listItems}</List>}
        <FloatingAction actionclick={this.add} actionIcon={<SvgIcons.ContentAdd />} />
      </div>
    );

  }

}