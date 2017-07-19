import * as React from 'react';
import { red500, red800, orange800, grey800 } from 'material-ui/styles/colors';
import 'typeface-roboto';

import { AgentStatus } from '../reducers/home'


/*
$ ->
  mapsvg = Snap $("svg")[0]
  setTimeout ( =>
    path = mapsvg.select('#California')
    smallScale = new Snap.Matrix()
    smallScale.scale(0.8,0.8, path.getBBox().cx, path.getBBox().cy)
    path.animate {transform: smallScale}, 1000, mina.elastic
  ), 500
  mapsvg.hover ((e)->
    s = Snap e.target
    p = s.select('path')
    midScale = new Snap.Matrix()
    midScale.scale(0.9, 0.9, p.getBBox().cx, p.getBBox().cy)
    p.animate {
      transform: midScale
    }, 1000, mina.elastic
  ), ((e)->
    s = Snap e.target
    p = s.select('path')
    midScale = new Snap.Matrix()
    midScale.scale(0.8, 0.8, p.getBBox().cx, p.getBBox().cy)
    p.animate {
      transform: midScale
    }, 1000, mina.elastic
  )
*/


interface Props {
  status: AgentStatus
}

interface State {
  hover: boolean
}

export class Heart extends React.Component<Props, State> {

  static styles = {
    alive: {
      fill: orange800
    },
    trusted: {
      fill: red800
    },
    hover: {
      fill: red500
    },
    asleep: {
      fill: grey800
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

  public render() {

    let statusStyle = {};
    
    switch (this.props.status) {
      case AgentStatus.Alive:
        statusStyle = Heart.styles.alive;
        break;
      case AgentStatus.Trusted:
        statusStyle = this.state.hover ? Heart.styles.hover : Heart.styles.trusted;
        break;
      default:
        statusStyle = Heart.styles.asleep;
        break;
    }
    
    const iconStyle = { ...Heart.styles.icon, ...statusStyle }

    return (
      <div>
        <svg onMouseEnter={e => this.toggleHover()} onMouseLeave={e => this.toggleHover()} viewBox="0 0 24 24" style={iconStyle}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
      </div >

    );
  }

  private toggleHover() {
    this.setState({ hover: !this.state.hover })
  }

}
