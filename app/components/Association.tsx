import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField, RaisedButton } from 'material-ui'
import { grey300, white } from 'material-ui/styles/colors';


export interface Props extends RouteComponentProps<any> {
  email: string
}

export class Association extends React.Component<Props> {

  static styles = {
    container: {
      textAlign: "center",
      fontFamily: "Roboto, sans-serif",
      color: white
    },
    paragraph: {
      textAlign: "left",
      margin: 28,
      color: grey300
    },
    button: {
      margin: 12
    }
  };

  public render() {

    return (
      <div style={Association.styles.container}>
        <h2>Associer votre agent</h2>
        <p style={Association.styles.paragraph}>Pour associer votre agent, il suffit de nous indiquer
          votre email de contact tel que vous nous l'avez précédemment communiqué.</p>
        <p style={Association.styles.paragraph}>Vous pouvez aussi identifier cet agent au sein de votre réseau en lui
            donnant le nom que vous voulez, ou bien lui laisser celui que nous avons choisi pour vous.</p>
        <TextField
          hintText="votre.email@contact.fr"
          floatingLabelText="Email de contact"
        />
        <TextField
          defaultValue="John Doe"
          floatingLabelText="Identifiant"
        />
        <br/>
        <br/>
        <br/>
        <RaisedButton style={Association.styles.button}>Annuler</RaisedButton>
        <RaisedButton primary={true} style={Association.styles.button}>Associer</RaisedButton>
      </div >

    );
  }


}