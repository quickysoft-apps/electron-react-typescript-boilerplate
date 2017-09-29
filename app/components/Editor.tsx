import * as React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/csharp';
import 'brace/mode/json';
import 'brace/theme/monokai';

export interface Props {
  name?: string;
  onChange?: (value: string, event?: any) => void;
  mode?: string;
  readOnly?: boolean;
  value?: string;
  defaultValue?: string;
}

const style: React.CSSProperties = {
  height: 404,
  position: "absolute",
  width: '100%'
};

export class Editor extends React.Component<Props> {

  public render() {
    return (
      <div
        style={style}>
        <AceEditor
          mode={this.props.mode}
          readOnly={this.props.readOnly}
          value={this.props.value}
          defaultValue={this.props.defaultValue}
          theme="monokai"
          height="100%"          
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            showLineNumbers: true,
            hScrollBarAlwaysVisible: false,
            vScrollBarAlwaysVisible: false,
            tabSize: 4,
          }} />
        {this.props.children}
      </div>
    );
  }

}