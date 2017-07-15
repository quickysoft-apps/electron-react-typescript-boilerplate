import * as React from 'react';
//import * as Log from 'electron-log'
import { Card, CardActions, CardHeader, CardMedia, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui'
import { red500, red800, orange800, grey800 } from 'material-ui/styles/colors';
import 'typeface-roboto';

//const avatar = require('../../resources/icons/ykp-simple-logo128.png');

export enum HomeStatus {
  Asleep = 0,
  Alive,
  Trusted
}

interface Props {
  status: HomeStatus
}

interface State {
  hover: boolean
}

export class Home extends React.Component<Props, State> {

  static styles = {
    container: {
      // textAlign: "center"
    },
    heart: {
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
    }
  };

  public constructor(props: Props) {
    super(props);
    this.state = { hover: false };
  }

  public render() {

    let statusStyle = {};
    switch (this.props.status) {
      case HomeStatus.Alive:
        statusStyle = Home.styles.heart.alive;
        break;
      case HomeStatus.Trusted:
        statusStyle = this.state.hover ? Home.styles.heart.hover : Home.styles.heart.trusted;
        break;
      default:
        statusStyle = Home.styles.heart.asleep;
        break;
    }
    const iconStyle = { ...Home.styles.heart.icon, ...statusStyle }

    return (
      <div style={Home.styles.container}>
        <Card>
          <CardHeader
            title="Gorgeous Samir"
          />
          <CardMedia>
            <svg onMouseEnter={e => this.toggleHover()} onMouseLeave={e => this.toggleHover()} viewBox="0 0 24 24" style={iconStyle}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </CardMedia>
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          <CardActions>
            <FlatButton label="Action1" />
            <FlatButton label="Action2" />
          </CardActions>
        </Card>
      </div >

    );
  }

  private toggleHover() {
    this.setState({ hover: !this.state.hover })
  }

}
