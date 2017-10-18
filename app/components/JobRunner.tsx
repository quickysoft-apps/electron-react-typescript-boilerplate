import * as React from 'react';
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
  title: string;
  input: string;
  inputError: Object | undefined;  
}

export interface IProps extends RouteComponentProps<any> {
  addLibrary: (jobId: string) => void;
  selectLibrary: (name: string) => void;
  removeLibrary: (name: string) => void;
  start: (job: JobDefinition) => void;
  save: (job: JobDefinition) => void;
  stop: VoidFunction;
  jobId: string;
  cron: string;
  input: Object;
  isRunning: boolean;
  script: string;
  result?: Object;
  title: string;
  scriptError?: Object;
  libraries: Array<ILibraryReference>;
}

export class JobRunner extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      script: props.script,
      cron: props.cron,
      title: props.title,
      input: this.toJsonString(props.input),
      inputError: undefined
    };
  }

  toJsonString(value: Object | undefined):string {
    return JSON.stringify(value, null, "  ");
  }

  getInput():any {
    try {
      return JSON.parse(this.state.input);
    } catch (error) {
      console.warn("Cannot use invalid input for script execution:", error);
      return undefined;
    }
  }

  checkInput():boolean {
    return !!this.getInput();
  }

  public render():JSX.Element { 

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
                    width: "100%"
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
              showLineNumbers={true}
            >
              {this.props.isRunning ?
                <FloatingAction
                  actionIcon={<SvgIcons.AvStop />}
                  actionclick={this.props.stop}
                  secondary={true} /> :
                <FloatingAction
                  actionIcon={<SvgIcons.AvPlayArrow />}
                  disabled={!!this.state.inputError}
                  actionclick={() => {
                    this.props.start({
                      jobId: this.props.jobId,
                      script: this.state.script,
                      input: this.getInput(),
                      cron: this.state.cron,
                      title: this.state.title,
                      libraries: this.props.libraries
                    });
                  }}
                />
              }
            </Editor>
          </Tab>
          <Tab
            icon={<SvgIcons.ContentLink />}>
            <LibrariesManager
              onAdd={() => this.props.addLibrary(this.props.jobId)}
              onDelete={(name: string) => this.props.removeLibrary(name) }
              libraries={this.props.libraries} />
          </Tab>
          <Tab
            icon={<SvgIcons.ActionInput />}>
            <Editor
              mode="json"
              name="input-editor"
              onChange={(value: string, event?: any) => {
                try {
                  JSON.parse(value);
                  this.setState({ inputError: undefined });
                } catch (error) {
                  this.setState({ inputError: error });
                }
                this.setState({ input: value });
              }}
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
              onChange={(value: string, event?: any) => this.setState({ input: value })}
              value={this.props.scriptError ? this.toJsonString(this.props.scriptError) : this.toJsonString(this.props.result)}
            />
          </Tab>
        </Tabs>
      </div >
    );
  }

  componentWillUnmount():void {

    if (!this.state.inputError) {
      const job: IJobDefinition = {
        jobId: this.props.jobId,
        script: this.state.script,
        title: this.state.title,
        cron: this.state.cron,
        input: this.getInput(),
        libraries: this.props.libraries
      };
      this.props.save(job);
    } else {
      // do not save invalid inputs
      console.warn("Cannot save invalid input:", this.state.inputError);
    }

  }

}