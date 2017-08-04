import * as React from 'react';
import { Location } from 'history';
import { RouterAction } from 'react-router-redux';
import { AppBar, IconButton } from 'material-ui'
import BrowserWindow from './BrowserWindow';
import * as SvgIcons from 'material-ui/svg-icons';

export interface Props {
  goBack: () => RouterAction;
  hide: VoidFunction;
  show: VoidFunction;
  visible: boolean;
  title: string;
  location: Location | null;  
}

export class App extends React.Component<Props> {

  public render() {

    const styles = {
      appBar: {
        webkitAppRegion: "drag",
        webkitUserSelect: "none"
      },
      button: {
        webkitAppRegion: "no-drag"
      }
    }

    let leftElement: JSX.Element = <IconButton><SvgIcons.NavigationMenu /></IconButton>;

    if (this.props.location && this.props.location.pathname !== '/') {
      leftElement = <IconButton onClick={this.props.goBack}><SvgIcons.NavigationArrowBack /></IconButton>;
    }

    return (
      <div>
        <BrowserWindow
          visible={this.props.visible}
          title={this.props.title}
          onShow={this.props.show}
        />
        <AppBar
          iconStyleLeft={styles.button}
          iconStyleRight={styles.button}
          showMenuIconButton={true}
          style={styles.appBar}
          title={this.props.title}
          iconElementLeft={leftElement}
          iconElementRight={<IconButton onClick={this.props.hide}><SvgIcons.NavigationClose /></IconButton>} />
        {this.props.children}
      </div >
    )

  }

}


