import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FlatButton } from 'material-ui'
import 'typeface-roboto';

import { AgentStatus } from '../reducers/home';
import { Heart } from './Heart';

export interface Props extends RouteComponentProps<any> {
  status: AgentStatus
}

export class Home extends React.Component<Props> {

  static styles = {
    container: {
      textAlign: "center"
    }
  };
  
  public render() {

    return (
      <div style={Home.styles.container}>

        <Heart status={this.props.status} />
        <FlatButton
          label={this.props.status === AgentStatus.Asleep ? "En attente du serveur..." : "Activer"}  
          primary={true}
          disabled={this.props.status === AgentStatus.Asleep} />

      </div >

    );
  }

}