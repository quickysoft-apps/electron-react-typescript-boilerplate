import * as React from 'react';
import * as Colors from 'material-ui/styles/colors';
import * as Snap from 'snapsvg-cjs';

import { AgentStatus } from '../reducers/home'

interface Props {
  status: AgentStatus,
  pongMS: number
}

interface State {
  hover: boolean
}

export class Heart extends React.Component<Props, State> {

  static styles = {
    alive: {
      fill: Colors.green400
    },
    trusted: {
      fill: Colors.red800
    },
    hover: {
      fill: Colors.red500
    },
    asleep: {
      fill: Colors.grey800
    },
    icon: {
      width: 256,
      height: 256,
      transition: "fill 0.5s ease",
      zIndex: 9999
    }
  };

  public constructor(props: Props) {
    super(props);
    this.state = { hover: false };
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    this.beat();
  }

  public render() {

    let statusStyle = {};

    switch (this.props.status) {
      case AgentStatus.Sick:
        statusStyle = Heart.styles.alive;
        break;
      case AgentStatus.Alive:
        statusStyle = this.state.hover ? Heart.styles.hover : Heart.styles.trusted;
        break;
      default:
        statusStyle = Heart.styles.asleep;
        break;
    }

    const iconStyle = { ...Heart.styles.icon, ...statusStyle }

    return (
      <div>
        <svg id="svg" onMouseEnter={e => this.toggleHover()} onMouseLeave={e => this.toggleHover()} viewBox="0 0 24 24" style={iconStyle}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div >

    );
  }

  private toggleHover() {
    this.setState({ hover: !this.state.hover })
  }

  private beat() {
    const svg = Snap('#svg');
    const path = svg.select('path');
    const fullScale = new Snap.Matrix();
    const midScale = new Snap.Matrix();
    midScale.scale(0.9, 0.9, path.getBBox().cx, path.getBBox().cy);
    fullScale.scale(1, 1, path.getBBox().cx, path.getBBox().cy);
    path.animate({ transform: fullScale }, 1000, mina.elastic);
    setTimeout(() => { path.animate({ transform: midScale }, 1000, mina.elastic); }, 100);
  }

}
