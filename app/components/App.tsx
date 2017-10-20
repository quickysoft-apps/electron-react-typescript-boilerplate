import * as React from 'react';
import { LocationDescriptor, LocationState } from 'history';
import { RouterAction } from 'react-router-redux';
import { AppBar, IconButton, Drawer, List, ListItem } from 'material-ui';
import BrowserWindow from './BrowserWindow';
import * as SvgIcons from 'material-ui/svg-icons';

export interface IProps {
  loadFromSettings: VoidFunction;
  push: (location: LocationDescriptor, state?: LocationState) => RouterAction;
  back: () => void;
  toggleMenu: (visible: boolean) => void;
  hide: VoidFunction;
  show: VoidFunction;
  isVisible: boolean;
  isMenuActive: boolean;
  title: string;
  email: string;
  nickname: string;
  navigationHistory: string[];
}

export class App extends React.Component<IProps> {

  public componentWillReceiveProps(nextProps: IProps): void {
    if (nextProps.navigationHistory.length < this.props.navigationHistory.length) {
      const pathname: string = nextProps.navigationHistory.slice(-1)[0];
      this.props.push(pathname);
    }
  }

  navigationMenuClick = (event: React.SyntheticEvent<any>): void => {
    this.props.toggleMenu(!this.props.isMenuActive);
  }

  drawerRequestChanged = (open: boolean, reason: string): void => {
    this.props.toggleMenu(open);
  }

  configurationMenuItemClick = (event: React.SyntheticEvent<any>): void => {
    this.props.toggleMenu(false);
    this.props.push('/configuration');
  }

  tasksMenuItemClick = (event: React.SyntheticEvent<any>): void => {
    this.props.toggleMenu(false);
    this.props.push('/jobManager');
  }

  taskHistoryMenuItemClick = (event: React.SyntheticEvent<any>): void => {
    this.props.toggleMenu(false);
    this.props.push('/jobHistory');
  }

  public render(): JSX.Element {

    let leftElement: JSX.Element = <IconButton>
      <SvgIcons.NavigationMenu onClick={this.navigationMenuClick} />
    </IconButton>;

    if (this.props.navigationHistory.length > 1) {
      leftElement = <IconButton onClick={this.props.back}><SvgIcons.NavigationArrowBack /></IconButton>;
    }

    const title: JSX.Element = <div>
      <div style={{ marginTop: 8 }}>{this.props.nickname}</div>
      <div style={{ fontSize: 'small', fontWeight: 300 }}>{this.props.email}</div>
    </div>;

    return (
      <div>
        <BrowserWindow
          visible={this.props.isVisible}
          title={this.props.title}
          onShow={this.props.show}
        />
        <AppBar
          iconStyleLeft={{ webkitAppRegion: 'no-drag' }}
          iconStyleRight={{ webkitAppRegion: 'no-drag' }}
          style={{ webkitAppRegion: 'drag', webkitUserSelect: 'none' }}
          titleStyle={{ lineHeight: 'normal' }}
          showMenuIconButton={true}
          title={title}
          iconElementLeft={leftElement}
          iconElementRight={<IconButton onClick={this.props.hide}><SvgIcons.ContentRemove /></IconButton>}
        />
        <Drawer
          containerStyle={{ top: 60 }}
          overlayStyle={{ top: 60 }}
          docked={false}
          width={200}
          open={this.props.isMenuActive}
          onRequestChange={this.drawerRequestChanged}>
          <List>
            <ListItem
              primaryText="Configuration"
              leftIcon={<SvgIcons.ActionSettings />}
              onClick={this.configurationMenuItemClick} />
            <ListItem
              primaryText="Tâches"
              leftIcon={<SvgIcons.AvPlaylistPlay />}
              onClick={this.tasksMenuItemClick} />
            <ListItem
              primaryText="Historique"
              leftIcon={<SvgIcons.ActionHistory />}
              onClick={this.taskHistoryMenuItemClick} />
          </List>
        </Drawer>
        {this.props.children}
      </div >
    );

  }

  componentDidMount(): void {
    this.props.loadFromSettings();
  }

}
