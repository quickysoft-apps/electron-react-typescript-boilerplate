import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Dialog, FlatButton } from 'material-ui';
import { InfoBox } from './InfoBox'
import * as SvgIcons from 'material-ui/svg-icons';

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

    let statusDetails = <div>
      <InfoBox
        style={{ marginTop: 6, marginBottom: 0 }}
        leftIcon={<SvgIcons.HardwareCastConnected />}
        primaryText="Statut de la connexion"
        secondaryText={statusText} />
      <InfoBox
        style={{ marginTop: 6, marginBottom: 0 }}
        leftIcon={<SvgIcons.DeviceAccessTime />}
        primaryText="Dernière connexion effective"
        secondaryText={this.props.connectedSince} />
      <InfoBox
        style={{ marginTop: 6, marginBottom: 0 }}
        leftIcon={<SvgIcons.ActionSettingsBackupRestore />}
        primaryText="Réponse au ping"
        secondaryText={`${this.props.pongMs} ms.`} />
    </div>

    if (this.props.isTrusted === true && !this.props.isConfigured) {
      statusDetails = <Dialog
        title="Configuration initiale requise"
        actions={[
          <Link to="/configuration">
            <FlatButton
              label="Configurer"
              primary={true} />
          </Link>
        ]}
        modal={true}
        open={true}      >
        <p>C'est la première fois que cet agent s'exécute. Pour qu'il soit opérationnel, il est
        nécessaire de configurer à minima votre email de contact.</p>
        <p>Pour votre information, cet agent sera exécuté à chaque démarrage de votre système.</p>
      </Dialog>
    }

    return (
      <div>
        <div style={styles.container}>
          <Heart
            status={this.props.status}
            pongMS={this.props.pongMs}
            onClick={() => this.props.history.push('/scriptRunner')} />
        </div>
        {statusDetails}
      </div >
    );
  }

}