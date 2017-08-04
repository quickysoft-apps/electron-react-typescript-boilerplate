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
          votre email de contact afin de permettre à un opérateur 
          Yakapa d'interagir avec votre agent avec votre autorisation.</p>
        <p style={Configuration.styles.paragraph}>Si vous le souhaitez, vous pouvez identifier
          cet agent pour le distinguer des autres agents que vous possédez déjà.</p>
        <ValidatorForm
          ref="form"          
          onSubmit={() => {
            const nickname: string = this.state.nickname.trim();
            this.props.save({
              email: this.state.email,
              nickname: nickname.length === 0 ? this.state.initialNickName : nickname
            })
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
            floatingLabelText="Identification"
            floatingLabelFixed={true}
            value={this.state.nickname}
            validators={['isValidNickname']}
            errorMessages={["L'identifiant ne peut pas contenir de caractères spéciaux et ne doit pas dépasser 20 caractères"]}
            onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ nickname: newValue })}
          />
          <br />
          <br />
          <RaisedButton style={Configuration.styles.button} onClick={() => this.props.history.push("/")}>Annuler</RaisedButton>
          <RaisedButton primary={true} style={Configuration.styles.button} type="submit">Valider</RaisedButton>
        </ValidatorForm>
      </div >

    );
  }

}