import * as React from 'react';
import { AppBar, IconButton } from 'material-ui'
import BrowserWindow from './BrowserWindow';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export interface Props {
  hide: VoidFunction;
  show: VoidFunction;
  visible: boolean;
  title?: string;
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
          showMenuIconButton={false}
          style={styles.appBar}
          title={this.props.title}
          iconElementRight={<IconButton onClick={this.props.hide}><NavigationClose /></IconButton>} />
        {this.props.children}
      </div >
    )

  }

}


