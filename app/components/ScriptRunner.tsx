import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField, Paper, FloatingActionButton } from 'material-ui'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import * as SvgIcons from 'material-ui/svg-icons';
import { ScriptRunnerItem } from '../actions/scriptRunner';

interface State {
  script: string;
  cron?: string;
}

export interface Props extends RouteComponentProps<any> {
  executeAsync: (options: ScriptRunnerItem) => void;
  stopCurrent: VoidFunction;
  running: boolean;
  current?: ScriptRunnerItem;
  runs: Map<string, ScriptRunnerItem>;
}

export class ScriptRunner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      script: props.current ? props.current.code : ''
    }
  }

  public render() {

    return (
      <Tabs>
        <Tab icon={<SvgIcons.ActionHistory />}>
        </Tab>
        <Tab icon={<SvgIcons.ActionCode />}>
          <Toolbar>
            <ToolbarGroup>
              <TextField
                name="cron"
                floatingLabelFixed={true}
                underlineShow={false}
                floatingLabelText="Fréquence"
                hintText="*/5 * * * * *"
                value={this.state.cron}
                onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ cron: newValue })}
              />
            </ToolbarGroup>
          </Toolbar>
          <ValidatorForm
            style={{ textAlign: 'right' }}
            ref="form"
            onSubmit={() => {
              this.props.executeAsync({
                code: this.state.script,
                input: null,
                cron: this.state.cron
              });
            }}>
            <Paper
              zDepth={1}
              style={{
                display: 'inline-block',
                width: '100%',
                padding: 6
              }}
              rounded={false}>
              <TextValidator
                style={{ textAlign: 'left' }}
                name="script"
                hintText="C# script..."
                multiLine={true}
                fullWidth={true}
                rows={13}
                rowsMax={13}
                underlineShow={false}
                value={this.state.script}
                validators={['required']}
                errorMessages={['Pas de code à exécuter']}
                onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ script: newValue })}
              />
            </Paper>
            <FloatingActionButton
              style={{
                marginTop: -28,
                marginRight: 12
              }}
              secondary={true}
              disabled={!this.props.running}
              onClick={this.props.stopCurrent}>
              <SvgIcons.AvStop />
            </FloatingActionButton>
            <FloatingActionButton
              style={{
                marginTop: -28,
                marginRight: 12
              }}
              disabled={this.props.running}
              type="submit">
              <SvgIcons.AvPlayArrow />
            </FloatingActionButton>
          </ValidatorForm>
        </Tab>
        <Tab
          style={{ fontWeight: 700 }}
          label="{...}">
          <Paper
            zDepth={1}
            style={{
              display: 'inline-block',
              width: '100%',
              padding: 6
            }}
            rounded={false}>
            <TextField
              name="result"
              style={{ textAlign: 'left' }}
              disabled={true}
              multiLine={true}
              fullWidth={true}
              rows={15}
              rowsMax={15}
              underlineShow={false}
              value={
                this.props.current && this.props.current.result ?
                  this.props.current.result.toString() :
                  '(vide)'
              }
            />
          </Paper>
        </Tab>
      </Tabs>
    );
  }

}