import * as React from 'react';
import { FloatingActionButton } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

export interface Props {
  actionIcon?: JSX.Element;
  actionclick?: VoidFunction;
  title: string;
}

export class TopSheet extends React.Component<Props> {

  public render() {
    return (
      <div
        style={{
          backgroundColor: fade(Colors.grey800, 0.33),
          height: this.props.actionIcon ? 64 : 54,
          marginBottom: this.props.actionIcon ? 32 : 0
        }}>
        <h3
          style={{
            marginTop: 0,
            paddingLeft: 64,
            paddingTop: 16
          }}>{this.props.title}</h3>
        {this.props.actionIcon ?
          <FloatingActionButton
            style={{
              marginTop: -16,
              marginLeft: 16
            }}
            mini={true}
            onClick={() => this.props.actionclick ? this.props.actionclick() : () => { }}>
            {this.props.actionIcon}
          </FloatingActionButton> : undefined}

      </div>
    );
  }

}