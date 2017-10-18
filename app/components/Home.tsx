import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Avatar, Dialog, FlatButton } from "material-ui";
import { List, ListItem } from "material-ui/List";
import * as SvgIcons from "material-ui/svg-icons";

import { AgentStatus } from "../reducers/home";
import { Heart } from "./Heart";

export interface IProps extends RouteComponentProps<any> {
  loadFromSettings: VoidFunction;
  status: AgentStatus;
  isTrusted: boolean;
  isConnected: boolean;
  isConfigured: boolean;
  pongMs: number;
  connectedSince: string;
  email: string;
  nickname: string;
  version: string;
}

// tslint:disable-next-line:typedef
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

export class Home extends React.Component<IProps> {

  public render(): JSX.Element {

    let statusText: string = "Prêt";

    if (!this.props.isConfigured) {
      statusText = "Configuration requise";
    }

    if (!this.props.isTrusted) {
      statusText = "Identification de l'agent";
    }

    if (!this.props.isConnected) {
      statusText = "Connexion au serveur";
    }

    let statusDetails: JSX.Element = <List>
      <ListItem
        leftAvatar={<Avatar icon={<Heart status={this.props.status} />} />}
        primaryText="Statut de la connexion"
        secondaryText={statusText} />
      <ListItem
        disabled={true}
        leftAvatar={<Avatar icon={<SvgIcons.DeviceAccessTime />} />}
        primaryText="Dernière connexion effective"
        secondaryText={this.props.connectedSince} />
      <ListItem
        disabled={true}
        leftAvatar={<Avatar icon={<SvgIcons.NotificationNetworkCheck />} />}
        primaryText="Réponse au ping"
        secondaryText={`${this.props.pongMs} ms.`} />
      <ListItem
        disabled={true}
        leftAvatar={<Avatar icon={<SvgIcons.ActionInfo />} />}
        primaryText="Version"
        secondaryText={`${this.props.version}`} />
    </List>;

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
      </Dialog>;
    }

    return (
      <div>
        <div style={styles.container}>

        </div>
        {statusDetails}
      </div >
    );
  }

}