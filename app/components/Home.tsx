import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FlatButton } from 'material-ui'
import 'typeface-roboto';

import { AgentStatus } from '../reducers/home';
import { Heart } from './Heart';

export interface Props extends RouteComponentProps<any> {
  status: AgentStatus,
  socketError: Error
}

export class Home extends React.Component<Props> {

  static styles = {
    container: {
      textAlign: "center"
    }
  };

  public render() {

    let label: React.ReactNode;
    if (this.props.socketError) {
      label = <span>Agent non reconnu :(</span>;
    } else {
      label = <span>{this.props.status === AgentStatus.Asleep ? "Connexion au serveur..." : "Activer"}</span>;
    }

    const disabled = (this.props.socketError !== undefined || this.props.status === AgentStatus.Asleep)

    return (
      <div style={Home.styles.container}>

        <Heart status={this.props.status} />
        <FlatButton
          label={label}
          primary={true}
          disabled={disabled} />

      </div >

    );
  }

}