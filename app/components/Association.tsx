import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'material-ui'


export interface Props extends RouteComponentProps<any> {
  email: string
}

export class Association extends React.Component<Props> {

  static styles = {
    container: {
      textAlign: "center"
    }
  };

  public render() {
        
    return (
      <div style={Association.styles.container}>
        <TextField
          hintText="votre.email@contact.fr"
          floatingLabelText="Email"
        />
      </div >

    );
  }


}