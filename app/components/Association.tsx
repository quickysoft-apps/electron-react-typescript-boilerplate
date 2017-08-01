import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField, RaisedButton } from 'material-ui'

import { AssociationData } from '../actions/association'

interface State {
  email: string;
  nickname: string;
}

export interface Props extends RouteComponentProps<any> {
  associate: (associationData: AssociationData) => void
  email: string;
  nickname: string;
}

export class Association extends React.Component<Props, State> {

  static styles = {
    container: {
      textAlign: "center",
    },
    paragraph: {
      textAlign: "left",
      margin: 28,
    },
    button: {
      margin: 12
    }
  };

  constructor(props: Props) {
    super(props)
    this.state = { email: '', nickname: '' }
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
    this.setState({
      email: nextProps.email,
      nickname: nextProps.nickname
    })
  }

  public render() {

    return (
      <div style={Association.styles.container}>
        <h2>Associer votre agent</h2>
        <p style={Association.styles.paragraph}>Pour associer votre agent, il suffit d'indiquer
          l'email de contact qui servira de liaison avec votre opérateur Yakapa.</p>
        <p style={Association.styles.paragraph}>Vous pouvez aussi identifier cet agent au sein de votre réseau en lui
            donnant le nom que vous voulez, ou bien lui laisser celui que nous avons choisi pour vous.</p>
        <TextField
          hintText="votre.email@contact.fr"
          floatingLabelText="Email de contact"
          onChange={(e, newValue) => this.emailChanged(e, newValue)}
        />
        <TextField
          defaultValue="John Doe"
          floatingLabelText="Identifiant"
          onChange={(e, newValue) => this.nicknameChanged(e, newValue)}
        />
        <br />
        <br />
        <br />
        <RaisedButton style={Association.styles.button} onClick={() => this.cancel()}>Plus tard</RaisedButton>
        <RaisedButton primary={true} style={Association.styles.button} onClick={() => this.submit()}>Associer</RaisedButton>
      </div >

    );
  }

  private emailChanged(e: React.FormEvent<{}>, newValue: string) {
    this.setState({ email: newValue });
  }

  private nicknameChanged(e: React.FormEvent<{}>, newValue: string) {
    this.setState({ nickname: newValue });
  }

  private cancel() {
    //this.props.history.goBack();
    this.props.history.push("/");
  }

  private submit() {
    this.props.associate({
      email: this.state.email,
      nickname: this.state.nickname
    });
  }


}