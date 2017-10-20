import * as React from 'react';
import { FloatingActionButton } from 'material-ui';

export interface IProps {
  actionIcon: JSX.Element;
  actionclick: VoidFunction;
  secondary?: boolean;
  type?: string;
  disabled?: boolean;
}

export class FloatingAction extends React.Component<IProps> {

  buttonClick(): void {
    if (this.props.actionclick) {
      this.props.actionclick();
    }
  }

  public render(): JSX.Element {
    return (
      <div
        style={{
          position: 'absolute',
          left: '83%',
          bottom: 24,
          textAlign: 'right'
        }}>
        {this.props.actionIcon ?
          <FloatingActionButton
            type={this.props.type}
            disabled={this.props.disabled}
            secondary={this.props.secondary}
            onClick={this.buttonClick}>
            {this.props.actionIcon}
          </FloatingActionButton> : undefined}
      </div>
    );
  }

}
