import * as React from 'react';
import { red500, red800, grey800 } from 'material-ui/styles/colors';
import * as Log from 'electron-log'

const containerStyle = {
  textAlign: "center"
}

const aliveStyle = { fill: red800 }
const asleepStyle = { fill: grey800 }
const aliveHoverStyle = { fill: red500 }

const svgStyle = {
  width: "75%",
  height: "75%",
  transition: "fill 0.5s ease"
}

interface Props { }

interface State {
  hover: boolean
}

export default class Home extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { hover: false };    
  }

  public toggleHover() {        
    this.setState({ hover: !this.state.hover })
  }

  public componentDidMount() {
    Log.debug('mounted');
  }

  public componentWillUnmount() {
    Log.debug('did unmout');
  }

  public render() {

    const aliveStyleWithHover = this.state.hover ? aliveHoverStyle : aliveStyle;
    const statusStyle = true ? aliveStyleWithHover : asleepStyle;
    const svgStyleWithStatus = { ...svgStyle, ...statusStyle }

    return (
      <div style={containerStyle}>
        <svg onMouseEnter={e => this.toggleHover()} onMouseLeave={e => this.toggleHover()} viewBox="0 0 24 24" style={svgStyleWithStatus}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

      </div>
    );
  }
}
