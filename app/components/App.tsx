import * as React from 'react';
import { Location } from 'history';
import { RouterAction } from 'react-router-redux';
import { AppBar, IconButton, Drawer, List, ListItem } from 'material-ui';
import BrowserWindow from './BrowserWindow';
import * as SvgIcons from 'material-ui/svg-icons';

export interface Props {
  goBack: () => RouterAction;
  push: (path: string) => RouterAction
  toggleMenu: (visible: boolean) => void;
  hide: VoidFunction;
  show: VoidFunction;
  isVisible: boolean;
  isMenuActive: boolean;
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
      drawer: {
        top: 50
      },
      drawerOverlay: {
        top: 50
      },
      button: {
        webkitAppRegion: "no-drag"
      }
    }



    let leftElement: JSX.Element = <IconButton>
      <SvgIcons.NavigationMenu onClick={() => this.props.toggleMenu(!this.props.isMenuActive)} />
    </IconButton>;

    if (this.props.location && this.props.location.pathname !== '/') {
      leftElement = <IconButton onClick={this.props.goBack}><SvgIcons.NavigationArrowBack /></IconButton>;
    }

    return (
      <div>
        <BrowserWindow
          visible={this.props.isVisible}
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
          iconElementRight={<IconButton onClick={this.props.hide}><SvgIcons.ContentRemove /></IconButton>}>
        </AppBar>
        <Drawer
          containerStyle={styles.drawer}
          overlayStyle={styles.drawerOverlay}
          docked={false}
          width={200}
          open={this.props.isMenuActive}
          onRequestChange={(open, reason) => this.props.toggleMenu(open)}>
          <List>
            <ListItem
              primaryText="Configuration"
              leftIcon={<SvgIcons.ActionSettings />}
              onClick={() => {
                this.props.toggleMenu(false);
                this.props.push('/configuration');
              }}/>            
          </List>
        </Drawer>
        {this.props.children}
      </div >
    )

  }



}


