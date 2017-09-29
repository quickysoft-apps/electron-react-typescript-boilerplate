import * as React from 'react';
import { FloatingActionButton } from 'material-ui';

export interface Props {
  actionIcon: JSX.Element;
  actionclick: VoidFunction;
  secondary?: boolean;
  type?: string;
}

export class FloatingAction extends React.Component<Props> {

  public render() {
    return (
      <div
        style={{
          position: 'absolute',
          left: '85%',
          bottom: 24,
          textAlign: 'right'
        }}>        
        {this.props.actionIcon ?
          <FloatingActionButton    
            type={this.props.type}        
            secondary={this.props.secondary}            
            onClick={() => this.props.actionclick ? this.props.actionclick() : () => { }}>
            {this.props.actionIcon}
          </FloatingActionButton> : undefined}
      </div>
    );
  }

}