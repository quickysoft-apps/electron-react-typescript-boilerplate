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
  showLineNumbers?: boolean;
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
          onChange={this.props.onChange}
          theme="monokai"
          height="100%"          
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          wrapEnabled={true}                    
          setOptions={{
            showLineNumbers: this.props.showLineNumbers,
            hScrollBarAlwaysVisible: false,
            vScrollBarAlwaysVisible: true,
            tabSize: 2
          }} />
        {this.props.children}
      </div>
    );
  }

}