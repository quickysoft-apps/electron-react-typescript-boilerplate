import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';

import { AgentStatus } from '../reducers/home';
import { Heart } from './Heart';

export interface Props extends RouteComponentProps<any> {
  status: AgentStatus,
  visible: boolean,
  isTrusted: boolean,
  isConnected: boolean,
  pongMs: number,
  configured: boolean
}

export class Home extends React.Component<Props> {

  static statusStyle: React.CSSProperties = {
    textTransform: "uppercase",
    color: Colors.grey600
  }

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

    let actionNode: React.ReactNode;
    if (!this.props.isTrusted) {
      actionNode = <p style={Home.statusStyle}>Identification de l'agent...</p>;
    }

    if (!this.props.isConnected) {
      actionNode = <p style={Home.statusStyle}>Connexion au serveur...</p>;
    }

    if (this.props.isConnected === true && this.props.isTrusted === true) {
      actionNode = <Link to="/configuration">
        <FlatButton
          label="Configurer"
          primary={true} />
      </Link>
    }

    if (this.props.configured) {
      actionNode = <div/>
    }

    const configurationTip = this.props.isTrusted ? <p style={Home.styles.paragraph}>
      Pour que cet agent soit pleinement opérationnel, il est nécessaire de le configurer avec
      à minima votre email de contact.</p> : <p />

    return (
      <div style={Home.styles.container}>

        {this.props.visible === true ? <Heart status={this.props.status} pongMS={this.props.pongMs} /> : <div />}
        {!this.props.configured ? configurationTip : <div/>}
        {actionNode}
      </div >

    );
  }

}