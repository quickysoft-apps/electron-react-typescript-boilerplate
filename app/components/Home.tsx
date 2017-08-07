import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
//import { RaisedButton, Paper, ListItem, Avatar } from 'material-ui';
import { InfoBox } from './InfoBox'
import * as SvgIcons from 'material-ui/svg-icons';
import * as Colors from 'material-ui/styles/colors';
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
    height: 258
  }
};

export class Home extends React.Component<Props> {

  public render() {

    let statusText = 'Prêt';

    if (!this.props.isConfigured) {
      statusText = "Configuration requise";
    }

    if (!this.props.isTrusted) {
      statusText = "Identification de l'agent";
    }

    if (!this.props.isConnected) {
      statusText = "Connexion au serveur";
    }

    let statusDetails = <Table
      selectable={false}
      style={{ backgroundColor: 'transparent' }} >
      <TableBody displayRowCheckbox={false}>
        <TableRow style={{ borderBottom: 0 }}>
          <TableRowColumn style={styles.rowColumn}>
            <InfoBox
              icon={<SvgIcons.HardwareCastConnected />}
              primaryText="Statut"
              secondaryText={statusText} />
          </TableRowColumn>
          <TableRowColumn style={styles.rowColumn}>
          </TableRowColumn>
        </TableRow>
        <TableRow>
          <TableRowColumn style={styles.rowColumn}>
            <InfoBox
              icon={<SvgIcons.DeviceAccessTime />}
              primaryText="Dernière connexion"
              secondaryText={this.props.connectedSince} />
          </TableRowColumn>
          <TableRowColumn style={styles.rowColumn}>
            <InfoBox
              icon={<SvgIcons.ActionSettingsBackupRestore />}
              primaryText="Réponse au ping"
              secondaryText={`${this.props.pongMs} ms.`} />
          </TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>

    if (this.props.isTrusted === true && !this.props.isConfigured) {
      statusDetails = <div>
        <InfoBox
          style={{
            marginTop: 64
          }}
          backgroundColor={Colors.pinkA200}
          disabled={false}
          containerElement={<Link to="/configuration" />}
          icon={<SvgIcons.AlertWarning />}
          primaryText="Configuration requise"
          secondaryText="Veuillez configurer à minima votre email de contact"
        />
      </div>
    }

    return (
      <div>
        <div style={styles.container}>
          <Heart status={this.props.status} pongMS={this.props.pongMs} />
        </div>
        {statusDetails}
      </div >
    );
  }

}