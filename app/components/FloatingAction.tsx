import * as React from 'react';
import autobind from 'autobind-decorator';
import { FloatingActionButton } from 'material-ui';

export interface IProps {
  actionIcon: JSX.Element;
  onClick: VoidFunction;
  secondary?: boolean;
  type?: string;
  disabled?: boolean;
}

export class FloatingAction extends React.Component<IProps> {

  @autobind
  buttonClicked(): void {
    if (this.props.onClick) {
      this.props.onClick();
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
            onClick={this.buttonClicked}>
            {this.props.actionIcon}
          </FloatingActionButton> : undefined}
      </div>
    );
  }

}
