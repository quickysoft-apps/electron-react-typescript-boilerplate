import * as React from 'react';
import * as Colors from 'material-ui/styles/colors';
// tslint:disable-next-line:no-var-requires
const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

import { AgentStatus } from '../reducers/home';

interface IProps {
  onClick?: VoidFunction;
  status: AgentStatus;
  width?: number;
  height?: number;
}

interface IState {
  hover: boolean;
}

export class Heart extends React.Component<IProps, IState> {

  public constructor(props: IProps) {
    super(props);
    this.state = {
      hover: false
    };
  }

  onClick = (): void => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  onMouseEnter = (): void => {
    this.toggleHover();
  }

  onMouseLeave = (): void => {
    this.toggleHover();
  }

  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
    this.beat();
  }

  public render(): JSX.Element {

    const styles = {
      connecting: {
        fill: Colors.grey800
      },
      ready: {
        fill: Colors.green400
      },
      trusted: {
        fill: Colors.orange700
      },
      configured: {
        fill: Colors.red800
      },
      hover: {
        fill: Colors.red500
      },
      icon: {
        width: this.props.width ? this.props.width : 24,
        height: this.props.height ? this.props.height : 24,
        transition: 'fill 0.5s ease',
        zIndex: 9999
      }
    };

    let statusStyle = {};

    switch (this.props.status) {
      case AgentStatus.Connected:
        statusStyle = styles.ready;
        break;
      case AgentStatus.Trusted:
        statusStyle = styles.trusted;
        break;
      case AgentStatus.Configured:
        statusStyle = this.state.hover ? styles.hover : styles.configured;
        break;
      default:
        statusStyle = styles.connecting;
        break;
    }

    const iconStyle = { ...styles.icon, ...statusStyle };

    return (
      <div>
        <svg
          id="svg"
          style={iconStyle}
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          viewBox="0 0 24 24" >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div >

    );
  }

  private toggleHover(): void {
    if (this.props.status === AgentStatus.Configured) {
      this.setState({ hover: !this.state.hover });
    }
  }

  private beat(): void {
    const svg = Snap('#svg');
    const path = svg.select('path');
    const fullScale = new Snap.Matrix();
    const midScale = new Snap.Matrix();
    midScale.scale(1, 1, path.getBBox().cx, path.getBBox().cy);
    fullScale.scale(1.1, 1.1, path.getBBox().cx, path.getBBox().cy);
    path.animate({ transform: fullScale }, 1000, mina.elastic);
    setTimeout(() => { path.animate({ transform: midScale }, 1000, mina.elastic); }, 100);
  }

}
