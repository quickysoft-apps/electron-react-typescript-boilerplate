import * as React from 'react';
import * as uuid from 'uuid';
import { RouteComponentProps } from 'react-router';
import { Paper, RaisedButton } from 'material-ui'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { ScriptRunnerOptions, ScriptRunnerResult } from '../actions/scriptRunner';

interface State {
  script: string;
}

export interface Props extends RouteComponentProps<any> {
  executeAsync: (options: ScriptRunnerOptions) => void;
  lastExecutionId?: string;
  currentScript?: string;
  results: Map<string, ScriptRunnerResult>;
}

export class ScriptRunner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      script: props.currentScript ? props.currentScript : ''
    }
  }

  public render() {

    return (
      <div style={{
        margin: 16
      }}>
        <ValidatorForm
          ref="form"
          onSubmit={() => {
            this.props.executeAsync({
              executionId: uuid.v4(),
              payload: null,
              script: this.state.script
            });
          }}>
          <Paper
            zDepth={1}
            style={{
              display: 'inline-block',
              width: '100%'
            }}>
            <TextValidator
              style={{ margin: 6 }}
              name="script"
              hintText="C# script..."
              multiLine={true}
              fullWidth={true}
              rows={15}
              rowsMax={15}
              underlineShow={false}
              value={this.state.script}
              validators={['required']}
              errorMessages={['Pas de cpde à exécuter ?!']}
              onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ script: newValue })}
            />
          </Paper>
          <RaisedButton
            style={{
              textAlign: 'left',
              marginTop: 24
            }}
            primary={true}
            type="submit">
            Exécuter
          </RaisedButton>
        </ValidatorForm>
      </div>
    );
  }

}