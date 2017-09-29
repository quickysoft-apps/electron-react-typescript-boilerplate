import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'material-ui'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Editor } from './editor';
import * as SvgIcons from 'material-ui/svg-icons';
import { FloatingAction } from './FloatingAction';
import { JobDefinition } from '../actions/jobRunner';

interface State {
  cron?: string;
  script: string;
  title: string;
  input: string;
}

export interface Props extends RouteComponentProps<any> {
  start: (job: JobDefinition) => void;
  save: (job: JobDefinition) => void;
  stop: VoidFunction;
  jobId: string;
  cron: string;
  input: string;
  isRunning: boolean;
  script: string;
  result: Object;
  title: string;
  errorMessage: string;
}

export class JobRunner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      script: props.script,
      cron: props.cron,
      title: props.title,
      input: props.input
    }
  }

  public render() {

    return (
      <div>
        <Tabs>
          <Tab
            icon={<SvgIcons.ActionCode />}>
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
                <TextField
                  style={{
                    width: '100%'
                  }}
                  name="scriptTitle"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  floatingLabelText="Nom du Script"
                  hintText="exemple de script"
                  value={this.state.title}
                  onChange={(e: React.FormEvent<{}>, newValue: string) => this.setState({ title: newValue })}
                />
              </ToolbarGroup>
            </Toolbar>
            <Editor
              mode="csharp"
              name="script-editor"
              onChange={(value: string, event?: any) => this.setState({ script: value })}
              value={this.state.script}
            >
              {this.props.isRunning ?
                <FloatingAction
                  actionIcon={<SvgIcons.AvStop />}
                  actionclick={this.props.stop}
                  secondary={true} /> :
                <FloatingAction
                  actionIcon={<SvgIcons.AvPlayArrow />}
                  actionclick={() => {
                    this.props.start({
                      jobId: this.props.jobId,
                      script: this.state.script,
                      input: null,
                      cron: this.state.cron,
                      title: this.state.title
                    })
                  }}
                />
              }
            </Editor>
          </Tab>
          <Tab
            icon={<SvgIcons.ActionInput />}>
            <Editor
              mode="json"
              name="input-editor"
              onChange={(value: string, event?: any) => this.setState({ input: value })}
              value={this.state.input}
              defaultValue="{}"
            />
          </Tab>
          <Tab
            style={{ fontWeight: 700 }}
            label="{...}">
            <Editor
              mode="json"
              name="result-editor"
              onChange={(value: string, event?: any) => this.setState({ input: value })}
              value={this.props.errorMessage ? this.props.errorMessage : this.props.result.toString()}
              defaultValue="{}"
            />
          </Tab>
        </Tabs>
      </div >
    );
  }

  componentWillUnmount() {
    const job: JobDefinition = {
      jobId: this.props.jobId,
      script: this.state.script,
      title: this.state.title,
      cron: this.state.cron,
      input: null
    };
    this.props.save(job);
  }

}