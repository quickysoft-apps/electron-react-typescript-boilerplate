import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { FlatButton, Card, CardActions, CardTitle, CardText, List, ListItem, Subheader, Divider } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';

import { AgentStatus } from '../reducers/home';
import { Heart } from './Heart';

export interface Props extends RouteComponentProps<any> {
  status: AgentStatus,
  isTrusted: boolean,
  isConnected: boolean,
  isConfigured: boolean,
  pongMs: number,
  connectedSince: string,
  email: string,
  nickname: string
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

    let cardTitle = "Détails de l'agent";
    let cardText = <List>
      <Subheader>Configuration</Subheader>
      <ListItem
        primaryText="Identification"
        secondaryText={this.props.nickname} />
      <ListItem
        primaryText="Email de contact"
        secondaryText={this.props.email} />
      <Divider />
      <Subheader>Connectivité</Subheader>
      <ListItem
        primaryText="Dernière connection réussie"
        secondaryText={this.props.connectedSince} />
      <ListItem
        primaryText="Réponse au ping"
        secondaryText={`${this.props.pongMs} ms.`} />
    </List>;
    let cardActions = <div />;

    if (!this.props.isConfigured) {
      cardTitle = "Configuration requise";
    }

    if (!this.props.isTrusted) {
      cardTitle = "Identification de l'agent...";
    }

    if (!this.props.isConnected) {
      cardTitle = "Connexion au serveur...";
    }

    if (this.props.isTrusted === true && !this.props.isConfigured) {
      cardText = <div>
        Pour que cet agent soit pleinement opérationnel, il est nécessaire de le configurer
        avec à minima votre email de contact.
      </div>
      cardActions = <Link to="/configuration">
        <FlatButton
          label="Configurer"
          primary={true} />
      </Link>
    }

    return (
      <div>
        <div style={Home.styles.container}>
          <Heart status={this.props.status} pongMS={this.props.pongMs} />
        </div>
        <Card>
          <CardTitle title={cardTitle} />
          <CardText>{cardText}</CardText>
          <CardActions>
            {cardActions}
          </CardActions>
        </Card>
      </div >

    );
  }

}