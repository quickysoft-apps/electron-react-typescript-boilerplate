import * as React from 'react';
import { Avatar, ListItem, Paper } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

interface Props {
  primaryText: string;
  secondaryText: string;
  icon: React.ReactElement<any>;
  disabled?: boolean;
  backgroundColor?: string;
  containerElement?: React.ReactNode | string;
  style?: React.CSSProperties;
}

export class InfoBox extends React.Component<Props> {

  static defaultProps = {
    backgroundColor: Colors.grey800,
    disabled: true,
    style: { margin: 16 }
  }

  public render() {

    const icon = <div>{this.props.icon}</div>
    let textBackgroundColor = this.props.backgroundColor ? this.props.backgroundColor : Colors.grey800;
    let color1 = this.props.disabled ? fade(textBackgroundColor, 0.8) : fade(textBackgroundColor, 0.2);
    let color2 = this.props.disabled ? fade(textBackgroundColor, 0.2) : fade(textBackgroundColor, 0.8);        

    return (
      <Paper
        style={{ 
          marginLeft: 16, 
          marginRight: 16, 
          marginTop: 6,
          marginBottom: 6,
          ...this.props.style }}
        zDepth={1}>
        <ListItem
          innerDivStyle={{
            padding: '0px 0px 0px 52px'
          }}
          hoverColor={color2}
          containerElement={this.props.containerElement}
          disabled={this.props.disabled}
          leftAvatar={<Avatar
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 2,
              borderBottomLeftRadius: 2,
              marginTop: 0,
              top: 0,
              left: 0,
              backgroundColor: color2,
              padding: 6
            }}
            icon={icon} />}
          primaryText={<div style={{
            backgroundColor: color1,
            padding: '6px 0px 4px 4px',
            borderTopRightRadius: 2
          }}>
            {this.props.primaryText}
          </div>}
          secondaryText={<div style={{
            backgroundColor: color1,
            padding: 5,
            marginTop: 0,
            lineHeight: '14px',
            borderBottomRightRadius: 2
          }}>
            {this.props.secondaryText}
          </div>} />
      </Paper>
    );
  }

}