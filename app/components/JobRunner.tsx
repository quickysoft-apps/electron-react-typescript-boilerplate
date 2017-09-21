import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'material-ui'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import AceEditor from 'react-ace';
import 'brace/mode/csharp';
import 'brace/theme/monokai';
import * as Ps from 'perfect-scrollbar';
import * as SvgIcons from 'material-ui/svg-icons';
import { FloatingAction } from './FloatingAction';
import { JobDefinition } from '../actions/jobRunner';

interface State {
  cron?: string;
  script: string;
  title: string;
}

export interface Props extends RouteComponentProps<any> {
  start: (job: JobDefinition) => void;
  save: (job: JobDefinition) => void;
  stop: VoidFunction;
  jobId: string;
  cron: string;
  isRunning: boolean;
  hasError:boolean;
  script: string;
  result: any;
  title:string;
  error: Object;
}

export class JobRunner extends React.Component<Props, State> {

  private scriptEditor: any = undefined;

  constructor(props: Props) {
    super(props)
    this.state = {
      script: props.script,
      cron: props.cron,
      title:props.title
    }
  }

  public render() {

    const textAreaStyle = {
      display: 'inline-block',
      width: 494,
      paddingLeft: 6
    };

    const textAreaRowCount = 14;

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
              style={{
                position: 'absolute',
                height: 404,
                width: '100%'
              }}>
              <AceEditor
                ref={(editor) => { this.scriptEditor = editor; }}
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
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
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

  componentDidMount() {
    const scrollbars: Node[] = [];
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

    Ps.initialize(this.scriptEditor.refEditor);
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