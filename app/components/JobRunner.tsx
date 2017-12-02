import * as React from 'react';
import autobind from 'autobind-decorator';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'material-ui';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Editor } from './editor';
import * as SvgIcons from 'material-ui/svg-icons';
import { FloatingAction } from './FloatingAction';
import { LibrariesManager } from './LibrariesManager';
import { IJobDefinition, IJob } from '../actions/jobManager';

interface IState {
  cron?: string;
  script?: string;
  name: string;
  input: string;
  inputError: object | undefined;
}

export interface IProps extends RouteComponentProps<any> {
  openLibraryFromDisk: (jobId: string) => void;
  selectLibrary: (name: string) => void;
  removeLibrary: (name: string) => void;
  start: (job: IJob) => void;
  save: (job: IJob) => void;
  stop: VoidFunction;
  job: IJob;
  result?: object;
  scriptError?: object;
}

export class JobRunner extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      script: props.job.definition.script,
      cron: props.job.definition.cron,
      name: props.job.definition.name,
      input: this.toJsonString(props.job.definition.input),
      inputError: undefined
    };
  }

  toJsonString(value: object | undefined): string {
    return JSON.stringify(value, null, '  ');
  }

  get currentJob(): IJob {
    const definition: IJobDefinition = {
      ...this.props.job.definition,
      script: this.state.script,
      input: this.input,
      cron: this.state.cron,
      name: this.state.name
    };
    return {
      id: this.props.job.id,
      status: this.props.job.status,
      definition
    };
  }

  get input(): any {
    try {
      return JSON.parse(this.state.input);
    } catch (error) {
      return undefined;
    }
  }

  checkInput(): boolean {
    return !!this.input;
  }

  @autobind
  cronChanged(e: React.FormEvent<{}>, newValue: string): void {
    this.setState({ cron: newValue });
  }

  @autobind
  scriptNameChanged(e: React.FormEvent<{}>, newValue: string): void {
    this.setState({ name: newValue });
  }

  @autobind
  scriptEditorChanged(value: string, event?: any): void {
    this.setState({ script: value });
  }

  @autobind
  addLibrary(): void {
    this.props.openLibraryFromDisk(this.props.job.id);
  }

  @autobind
  libraryDeleted(name: string): void {
    this.props.removeLibrary(name);
  }

  @autobind
  inputEditorChanged(value: string, event?: any): void {
    try {
      JSON.parse(value);
      this.setState({ inputError: undefined });
    } catch (error) {
      this.setState({ inputError: error });
    }
    this.setState({ input: value });
  }

  @autobind
  startClicked(): void {
    this.props.start(this.currentJob);
  }

  public render(): JSX.Element {

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
                  onChange={this.cronChanged}
                />
                <TextField
                  style={{ width: '100%' }}
                  name="scriptTitle"
                  floatingLabelFixed={true}
                  underlineShow={false}
                  floatingLabelText="Nom du Script"
                  hintText="exemple de script"
                  value={this.state.name}
                  onChange={this.scriptNameChanged}
                />
              </ToolbarGroup>
            </Toolbar>
            <Editor
              mode="csharp"
              name="script-editor"
              onChange={this.scriptEditorChanged}
              value={this.state.script}
              showLineNumbers={true}
            >
              {this.props.job.status.isRunning ?
                <FloatingAction
                  actionIcon={<SvgIcons.AvStop />}
                  onClick={this.props.stop}
                  secondary={true} /> :
                <FloatingAction
                  actionIcon={<SvgIcons.AvPlayArrow />}
                  disabled={!!this.state.inputError}
                  onClick={this.startClicked}
                />
              }
            </Editor>
          </Tab>
          <Tab
            icon={<SvgIcons.ContentLink />}>
            <LibrariesManager
              onAdd={this.addLibrary}
              onDelete={this.libraryDeleted}
              libraries={this.props.job.definition.libraries} />
          </Tab>
          <Tab
            icon={<SvgIcons.ActionInput />}>
            <Editor
              mode="json"
              name="input-editor"
              onChange={this.inputEditorChanged}
              value={this.state.input}
            />
          </Tab>
          <Tab
            style={{ fontWeight: 700 }}
            label="{...}">
            <Editor
              mode="json"
              name="result-editor"
              readOnly={true}
              value={this.props.scriptError ? this.toJsonString(this.props.scriptError) : this.toJsonString(this.props.result)}
            />
          </Tab>
        </Tabs>
      </div >
    );
  }

  componentWillUnmount(): void {
    if (!this.state.inputError) {
      this.props.save(this.currentJob);
    }
  }

}
