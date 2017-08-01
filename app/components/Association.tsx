import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RaisedButton } from 'material-ui'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { AssociationData } from '../actions/association'

interface State {
  email: string;
  nickname: string;
  initialNickName: string;
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
    this.state = {
      email: '',
      nickname: '',
      initialNickName: props.nickname
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
    this.setState({
      email: nextProps.email,
      nickname: nextProps.nickname
    })
  }

  componentWillMount() {
    ValidatorForm.addValidationRule('isValidNickname',
      (value: string): boolean => value.length === 0 || !!value.match(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$/));
  }

  public render() {

    const nickname: string = this.state.nickname.trim();

    return (
      <div style={Association.styles.container}>
        <h2>Associer votre agent</h2>
        <p style={Association.styles.paragraph}>Pour associer votre agent, il suffit d'indiquer
          l'email de contact qui servira de liaison avec votre opérateur Yakapa.</p>
        <p style={Association.styles.paragraph}>Vous pouvez aussi changer l'identification cet agent 
          au sein de votre réseau en lui donnant le nom que vous voulez.</p>
        <ValidatorForm
          ref="form"
          onError={(errors: any) => console.error(errors)}
          onSubmit={() => {
            this.props.associate({
              email: this.state.email,
              nickname: nickname.length === 0 ? this.state.initialNickName : nickname
            });
            this.props.history.push("/");
          }}>
          <TextValidator
            name="email"
            hintText="votre.email@contact.fr"
            floatingLabelText="Email de contact"
            value={this.state.email}
            validators={['required', 'isEmail']}
            errorMessages={['Ce champ est obligatoire', "L'adresse email n'est pas valide"]}
            onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ email: newValue })}
          />
          <TextValidator
            name="nickname"
            hintText={this.state.initialNickName}
            floatingLabelText="Identifiant"
            floatingLabelFixed={true}
            value={this.state.nickname}
            validators={['isValidNickname']}
            errorMessages={["L'identifiant ne peut pas contenir de caractères spéciaux et ne doit pas dépasser 20 caractères"]}
            onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ nickname: newValue })}
          />
          <br />
          <br />
          <RaisedButton style={Association.styles.button} onClick={() => this.props.history.push("/")}>Plus tard</RaisedButton>
          <RaisedButton primary={true} style={Association.styles.button} type="submit">Associer</RaisedButton>
        </ValidatorForm>
      </div >

    );
  }

}