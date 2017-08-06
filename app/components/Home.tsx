import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Avatar, FlatButton, Card, CardActions, CardTitle, CardText, ListItem } from 'material-ui';
import * as SvgIcons from 'material-ui/svg-icons';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

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

const styles = {
  container: {
    textAlign: "center"
  },
  statusTitle: {
    paddingBottom: 0,
    textAlign: "center"
  },
  rowColumn: {
    paddingLeft: 0,
    paddingRight: 0
  },
  cardStyle: {
    height: 260
  }
};

export class Home extends React.Component<Props> {

  public render() {

    let statusTitle = "Détails de l'agent";

    let statusDetails = <Table selectable={false}>
      <TableBody displayRowCheckbox={false}>
        <TableRow>
          <TableRowColumn style={styles.rowColumn}>
            <ListItem
              disabled={true}
              leftAvatar={<Avatar icon={<SvgIcons.SocialPersonOutline />} />}
              primaryText="Identification"
              secondaryText={this.props.nickname} />
          </TableRowColumn>
          <TableRowColumn style={styles.rowColumn}>
            <ListItem
              disabled={true}
              leftAvatar={<Avatar icon={<SvgIcons.CommunicationMailOutline />} />}
              primaryText="Email de contact"
              secondaryText={this.props.email} />
          </TableRowColumn>
        </TableRow>
        <TableRow>
          <TableRowColumn style={styles.rowColumn}>
            <ListItem
              disabled={true}
              leftAvatar={<Avatar icon={<SvgIcons.DeviceAccessTime />} />}
              primaryText="Dernière connexion"
              secondaryText={this.props.connectedSince} />
          </TableRowColumn>
          <TableRowColumn style={styles.rowColumn}>
            <ListItem
              disabled={true}
              leftAvatar={<Avatar icon={<SvgIcons.ActionSettingsBackupRestore />} />}
              primaryText="Réponse au ping"
              secondaryText={`${this.props.pongMs} ms.`} />
          </TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>

    let cardActions = <div />;

    if (!this.props.isConfigured) {
      statusTitle = "Configuration requise";
    }

    if (!this.props.isTrusted) {
      statusTitle = "Identification de l'agent...";
    }

    if (!this.props.isConnected) {
      statusTitle = "Connexion au serveur...";
    }

    if (this.props.isTrusted === true && !this.props.isConfigured) {
      statusDetails = <div>
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
        <div style={styles.container}>
          <Heart status={this.props.status} pongMS={this.props.pongMs} />
        </div>
        <Card style={styles.cardStyle}>
          <CardTitle style={styles.statusTitle} title={statusTitle} />
          <CardText>{statusDetails}</CardText>
          <CardActions>
            {cardActions}
          </CardActions>
        </Card>
      </div >

    );
  }

}