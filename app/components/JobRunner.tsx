import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField, FloatingActionButton } from 'material-ui'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import * as SvgIcons from 'material-ui/svg-icons';
import { TopSheet } from './TopSheet';
import { Job } from '../actions/jobRunner';

interface State {
  cron?: string;
  script: string;
}

export interface Props extends RouteComponentProps<any> {
  executeAsync: (job: Job) => void;
  stop: VoidFunction;
  jobId: string;
  cron: string;
  running: boolean;
  script: string;
  result: any;
  error: Object;
}

export class JobRunner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      script: props.script,
      cron: props.cron
    }
  }

  public render() {

    const floatingStyle = {
      marginRight: 24
    };

    const textAreaStyle = {
      display: 'inline-block',
      width: 494,
      paddingLeft: 6
    };

    const textAreaRowCount = 14;

    return (
      <div>
        <TopSheet title="Nouvelle tâche" />
        <Tabs>
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
              ref="form"
              onSubmit={() => {
                this.props.executeAsync({
                  jobId: this.props.jobId,
                  script: this.state.script,
                  input: null,
                  cron: this.state.cron
                });
              }}>
              <div
                style={textAreaStyle}>
                <TextValidator
                  style={{ textAlign: 'left' }}
                  mini={true}
                  name="script"
                  hintText="C# script..."
                  multiLine={true}
                  fullWidth={true}
                  rows={textAreaRowCount}
                  rowsMax={textAreaRowCount}
                  underlineShow={false}
                  value={this.state.script}
                  validators={['required']}
                  errorMessages={['Pas de code à exécuter']}
                  onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ script: newValue })}
                />
              </div>
            </ValidatorForm>
            <div style={{
              width: '100%',
              textAlign: 'right',
              marginTop: -80
            }}>
              {this.props.running ?
                <FloatingActionButton
                  style={floatingStyle}
                  mini={true}
                  disabled={!this.props.running}
                  onClick={this.props.stop}>
                  <SvgIcons.AvStop />
                </FloatingActionButton> :
                <FloatingActionButton
                  style={floatingStyle}
                  disabled={this.props.running}
                  type="submit">
                  <SvgIcons.AvPlayArrow />
                </FloatingActionButton>}
            </div>
          </Tab>
          <Tab
            style={{ fontWeight: 700 }}
            label="{...}">
            <div
              style={textAreaStyle}>
              <TextField
                name="result"
                style={{ textAlign: 'left' }}
                disabled={true}
                multiLine={true}
                fullWidth={true}
                rows={textAreaRowCount}
                rowsMax={textAreaRowCount}
                underlineShow={false}
                value={
                  this.props.result ?
                    this.props.result.toString() :
                    this.props.error ?
                      this.props.error :
                      ''
                }
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }

}