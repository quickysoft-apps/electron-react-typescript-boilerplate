import * as React from 'react';
import { AppBar, IconButton } from 'material-ui'
import BrowserWindow from 'react-electron-browser-window';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

interface State {
  visible: boolean
}

export default function withLayout<P = {}>(title: string, Component: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P> {
  return class WithLayout extends React.Component<P, State> {

    public constructor(props: P) {
      super(props)
      this.state = { visible: true }
    }

    private hideWindow() {
      this.setState({ visible: false });
    }

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

      return (
        <div>
          <BrowserWindow
            visible={this.state.visible}
            alwaysOnTop={true}
            fullscreenable={false}
          />
          <AppBar
            iconStyleLeft={styles.button}
            iconStyleRight={styles.button}
            showMenuIconButton={false}
            style={styles.appBar}
            title={title}
            iconElementRight={<IconButton onClick={e => this.hideWindow()}><NavigationClose /></IconButton>} />
          <Component {...this.props} />
        </div >
      );
    }
  }
};

