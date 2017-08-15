import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RaisedButton } from 'material-ui'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { AgentConfiguration } from '../actions/configuration';

interface State {
  email: string;
  nickname: string;
  initialNickName: string;
}

export interface Props extends RouteComponentProps<any> {
  save: (configuration: AgentConfiguration) => void;
  email: string;
  nickname: string;
}

export class Configuration extends React.Component<Props, State> {

  static styles = {
    container: {
      textAlign: "center",
      margin: 28
    },
    paragraph: {
      textAlign: "left"
    }
  };

  constructor(props: Props) {
    super(props)
    this.state = {
      email: props.email,
      nickname: props.nickname,
      initialNickName: props.nickname
    }
  }

  componentWillMount() {
    ValidatorForm.addValidationRule('isValidNickname',
      (value: string): boolean => value.length === 0 || !!value.match(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$/));
  }

  public render() {

    return (
      <div style={Configuration.styles.container}>
        <h2>Configurer votre agent</h2>
        <p style={Configuration.styles.paragraph}>Il est nécessaire d'indiquer à minima
          votre email de contact afin d'autoriser à un opérateur
          Yakapa à interagir avec votre agent.</p>
        <p style={Configuration.styles.paragraph}>Si vous le souhaitez, vous pouvez identifier
          cet agent avec un nom particulier pour le distinguer des autres agents que vous possédez déjà.</p>
        <ValidatorForm
          ref="form"
          onSubmit={() => {
            const nickname: string = this.state.nickname.trim();
            this.props.save({
              email: this.state.email,
              nickname: nickname.length === 0 ? this.state.initialNickName : nickname
            })
            this.props.history.goBack();
          }}>
          <TextValidator
            style={{ textAlign: 'left' }}
            name="email"
            hintText="votre.email@contact.fr"
            floatingLabelText="Email de contact"
            value={this.state.email}
            validators={['required', 'isEmail']}
            errorMessages={['Ce champ est obligatoire', "Ça ne ressemble pas à une adresse email :/"]}
            onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ email: newValue })}
          />
          <TextValidator
            style={{ textAlign: 'left' }}
            name="nickname"
            hintText={this.state.initialNickName}
            floatingLabelText="Identification"
            floatingLabelFixed={true}
            value={this.state.nickname}
            validators={['isValidNickname']}
            errorMessages={["Pas de caractères spéciaux et moins 20 caractères !"]}
            onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ nickname: newValue })}
          />
          <br />
          <RaisedButton
            style={{
              textAlign: 'left',
              marginTop: 24
            }}
            primary={true}
            type="submit">
            Enregistrer
          </RaisedButton>
        </ValidatorForm>
      </div >

    );
  }

}