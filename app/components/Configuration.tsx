import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RaisedButton } from 'material-ui';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { IAgentConfiguration } from '../actions/configuration';

interface IState {
  email: string;
  nickname: string;
  initialNickName: string;
}

export interface IProps extends RouteComponentProps<any> {
  save: (configuration: IAgentConfiguration) => void;
  email: string;
  nickname: string;
}

export class Configuration extends React.Component<IProps, IState> {

  static styles: React.CSSProperties = {
    container: {
      textAlign: 'center',
      margin: 28
    },
    paragraph: {
      textAlign: 'left'
    }
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      email: props.email,
      nickname: props.nickname,
      initialNickName: props.nickname
    };
  }

  submit(): void {
    const nickname: string = this.state.nickname.trim();
    this.props.save({
      email: this.state.email,
      nickname: nickname.length === 0 ? this.state.initialNickName : nickname
    });
    this.props.history.goBack();
  }

  emailChanged(e: React.FormEvent<any>, newValue: string): void {
    this.setState({ email: newValue });
  }

  nicknameChanged(e: React.FormEvent<{}>, newValue: string): void {
    this.setState({ nickname: newValue });
  }

  componentWillMount(): void {
    ValidatorForm.addValidationRule('isValidNickname',
      (value: string): boolean => value.length === 0 || !!value.match(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$/));
  }

  public render(): JSX.Element {

    return (
      <div style={Configuration.styles.container}>
        <h2>Configurer votre agent</h2>
        <p style={Configuration.styles.paragraph}>Il est nécessaire d'indiquer à minima
          votre email de contact afin d'autoriser à un opérateur
          Yakapa à interagir avec votre agent.</p>
        <p style={Configuration.styles.paragraph}>Si vous le souhaitez, vous pouvez identifier
          cet agent avec un nom particulier pour le distinguer des autres agents que vous possédez déjà.</p>
        <ValidatorForm
          // tslint:disable-next-line:jsx-no-string-ref
          ref="form"
          onSubmit={this.submit}>
          <TextValidator
            style={{ textAlign: 'left' }}
            name="email"
            hintText="votre.email@contact.fr"
            floatingLabelText="Email de contact"
            value={this.state.email}
            validators={['required', 'isEmail']}
            errorMessages={['Ce champ est obligatoire', 'Ça ne ressemble pas à une adresse email :/']}
            onChange={this.emailChanged}
          />
          <TextValidator
            style={{ textAlign: 'left' }}
            name="nickname"
            hintText={this.state.initialNickName}
            floatingLabelText="Identification"
            floatingLabelFixed={true}
            value={this.state.nickname}
            validators={['isValidNickname']}
            errorMessages={['Pas de caractères spéciaux et moins 20 caractères !']}
            onChange={this.nicknameChanged}
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
