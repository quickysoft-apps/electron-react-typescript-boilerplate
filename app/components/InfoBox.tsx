import * as React from "react";
import { Avatar, ListItem, Paper } from "material-ui";
import * as Colors from "material-ui/styles/colors";
import { fade } from "material-ui/utils/colorManipulator";
import * as SvgIcons from "material-ui/svg-icons";

interface IProps {
  primaryText: string;
  secondaryText: string;
  leftIcon: React.ReactElement<any>;
  rightIcon?: React.ReactElement<any>;
  disabled?: boolean;
  backgroundColor?: string;
  containerElement?: React.ReactNode | string;
  style?: React.CSSProperties;
}

export class InfoBox extends React.Component<IProps> {

  static defaultProps = {
    backgroundColor: Colors.grey800,
    disabled: true,
    style: { margin: 16 },
    rightIcon: <SvgIcons.NavigationChevronRight style={{
      width: 32,
      height: 32,
      fill: fade(Colors.white, 0.8),
      margin: 0,
      right: 0,
      top: 10
    }} />
  };

  public render():JSX.Element {

    let textBackgroundColor:string = this.props.backgroundColor ? this.props.backgroundColor : Colors.grey800;
    let color1:string = this.props.disabled ? fade(textBackgroundColor, 0.8) : fade(textBackgroundColor, 0.2);
    let color2:string = this.props.disabled ? fade(textBackgroundColor, 0.2) : fade(textBackgroundColor, 0.8);

    return (
      <Paper
        style={{
          marginLeft: 48,
          marginRight: 48,
          marginTop: 6,
          marginBottom: 6,
          ...this.props.style
        }}
        zDepth={1}>
        <ListItem
          innerDivStyle={{
            padding: "0px 0px 0px 52px"
          }}
          hoverColor={color2}
          containerElement={this.props.containerElement}
          disabled={this.props.disabled}
          rightIcon={!this.props.disabled ? this.props.rightIcon : undefined}
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
            icon={<div>{this.props.leftIcon}</div>}
          />}
          primaryText={<div style={{
            backgroundColor: color1,
            padding: "6px 0px 4px 4px",
            borderTopRightRadius: 2
          }}>
            {this.props.primaryText}
          </div>}
          secondaryText={<div style={{
            backgroundColor: color1,
            padding: 5,
            marginTop: 0,
            lineHeight: "14px",
            borderBottomRightRadius: 2
          }}>
            {this.props.secondaryText}
          </div>} />
      </Paper>
    );
  }

}