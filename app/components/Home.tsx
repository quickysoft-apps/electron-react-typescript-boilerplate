import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FlatButton } from 'material-ui'

import { AgentStatus } from '../reducers/home';
import { Heart } from './Heart';

export interface Props extends RouteComponentProps<any> {
  status: AgentStatus,  
  trusted: boolean,
  pongMs: number
}

export class Home extends React.Component<Props> {

  static styles = {
    container: {
      textAlign: "center"
    }
  };

  public componentDidMount() {
    console.log('-------------------------Home componentDidMount');        
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>) {
    console.log('------------------------Home componentDidUpdate', this.props);
  }
  public render() {

    let label: React.ReactNode;
    if (this.props.trusted === false) {
      label = <span>Agent non reconnu :(</span>;
    } else {
      label = <span>{this.props.status === AgentStatus.Asleep ? "Connexion au serveur..." : "Activer"}</span>;
    }

    const disabled = (this.props.trusted === false || this.props.status === AgentStatus.Asleep)

    return (
      <div style={Home.styles.container}>

        <Heart status={this.props.status} pongMS={this.props.pongMs} />
        <FlatButton
          label={label}
          primary={true}
          disabled={disabled} />

      </div >

    );
  }

}