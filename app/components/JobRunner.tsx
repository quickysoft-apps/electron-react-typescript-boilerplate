import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'material-ui'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import AceEditor from 'react-ace';
import 'brace/mode/csharp';
import 'brace/mode/json';
import 'brace/theme/monokai';
//import * as Ps from 'perfect-scrollbar';
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
  hasError: boolean;
  script: string;
  result: any;
  title: string;
  error: Error;
}

const textAreaStyle: React.CSSProperties = {  
  height: 404,
  position: "absolute",
  width: '100%'
};

export class JobRunner extends React.Component<Props, State> {

  /*private scriptEditor: any = undefined;
  private inputEditor: any = undefined;
  private resultEditor: any = undefined;*/

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
            <div
            style={textAreaStyle}>
              <AceEditor
                mode="csharp"
                theme="monokai"
                name="script-editor"
                height="100%"
                onChange={(value: string, event?: any) => this.setState({ script: value })}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={this.state.script}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  showLineNumbers: true,
                  hScrollBarAlwaysVisible: false,
                  vScrollBarAlwaysVisible: false,
                  tabSize: 4,
                }} />
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
                  }} />
              }
            </div>
          </Tab>
          <Tab
            icon={<SvgIcons.ActionInput />}>
            <div
              style={textAreaStyle}>
              <AceEditor
                mode="json"
                theme="monokai"
                name="input-editor"
                height="100%"
                defaultValue="{}"
                onChange={(value: string, event?: any) => this.setState({ input: value })}
                fontSize={14}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={true}
                value={this.state.input}
                setOptions={{
                  hScrollBarAlwaysVisible: false,
                  vScrollBarAlwaysVisible: false,
                  tabSize: 4,
                }} />
            </div>
          </Tab>
          <Tab
            style={{ fontWeight: 700 }}
            label="{...}">
            <div
              style={textAreaStyle}>
              <AceEditor
                mode="json"
                theme="monokai"
                name="result-editor"
                height="100%"                
                fontSize={14}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={true}
                value={this.props.error ? this.props.error.message : this.props.result.toString()}
                setOptions={{
                  readOnly: true,
                  hScrollBarAlwaysVisible: false,
                  vScrollBarAlwaysVisible: false,
                  tabSize: 4,
                }} />              
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }

  componentDidMount() {
    /*const scrollbars: Node[] = [];
    this.scriptEditor.refEditor.childNodes.forEach((e: HTMLTextAreaElement) => {
      if (e.className === 'ace_scrollbar ace_scrollbar-h') {
        scrollbars.push(e);
      }
      if (e.className === 'ace_scrollbar ace_scrollbar-v') {
        scrollbars.push(e);
      }
    })

    for (let node of scrollbars) {
      this.scriptEditor.refEditor.removeChild(node);
    }

    Ps.initialize(this.scriptEditor.refEditor);*/
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