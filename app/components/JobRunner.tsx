import * as React from 'react';
import autobind from 'autobind-decorator';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'material-ui';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Editor } from './editor';
import * as SvgIcons from 'material-ui/svg-icons';
import { FloatingAction } from './FloatingAction';
import { IJobDefinition, ILibraryReference } from '../actions/jobRunner';
import { LibrariesManager } from './LibrariesManager';

interface IState {
  cron?: string;
  script: string;
  name: string;
  input: string;
  inputError: object | undefined;
}

export interface IProps extends RouteComponentProps<any> {
  openLibraryFromDisk: (jobId: string) => void;
  selectLibrary: (name: string) => void;
  removeLibrary: (name: string) => void;
  start: (job: IJobDefinition) => void;
  save: (job: IJobDefinition) => void;
  stop: VoidFunction;
  jobId: string;
  cron: string;
  input: object;
  isRunning: boolean;
  script: string;
  result?: object;
  name: string;
  scriptError?: object;
  libraries: ILibraryReference[];
}

export class JobRunner extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      script: props.script,
      cron: props.cron,
      name: props.name,
      input: this.toJsonString(props.input),
      inputError: undefined
    };
  }

  toJsonString(value: object | undefined): string {
    return JSON.stringify(value, null, '  ');
  }

  getInput(): any {
    try {
      return JSON.parse(this.state.input);
    } catch (error) {
      return undefined;
    }
  }

  checkInput(): boolean {
    return !!this.getInput();
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
    this.props.openLibraryFromDisk(this.props.jobId);
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
    this.props.start({
      jobId: this.props.jobId,
      script: this.state.script,
      input: this.getInput(),
      cron: this.state.cron,
      name: this.state.name,
      libraries: this.props.libraries
    });
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
              {this.props.isRunning ?
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
              libraries={this.props.libraries} />
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
      const job: IJobDefinition = {
        jobId: this.props.jobId,
        script: this.state.script,
        name: this.state.name,
        cron: this.state.cron,
        input: this.getInput(),
        libraries: this.props.libraries
      };
      this.props.save(job);
    }
  }

}
