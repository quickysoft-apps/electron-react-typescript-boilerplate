import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
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
      textAlign: "center",
    },
    paragraph: {
      textAlign: "left",
      margin: 28,
    }
  };

  public render() {

    let label: React.ReactNode;
    if (this.props.trusted === false) {
      label = <span>Erreur d'identification :(</span>;
    } else {
      label = <span>{this.props.status === AgentStatus.Asleep ? "Connexion au serveur..." : "Associer"}</span>;
    }

    const disabled = (this.props.trusted === false || this.props.status === AgentStatus.Asleep)

    const instructions = this.props.status === AgentStatus.Trusted ? <p style={Home.styles.paragraph}>
      Pour que cet agent soit pleinement opérationnel, il est nécessaire de l'associer avec votre 
      opérateur Yakapa en lui fournissant votre email de contact.
    </p> : <p/>

    return (
      <div style={Home.styles.container}>

        <Heart status={this.props.status} pongMS={this.props.pongMs} />
        {instructions}
        <Link to="/association" >
          <FlatButton
            label={label}
            primary={true}
            disabled={disabled} />
        </Link>

      </div >

    );
  }

}