import * as React from 'react';
import { remote, nativeImage } from 'electron';

type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen' | 'kiosk';
type MacOSVibrancy = 'light' | 'dark' | 'titlebar' | 'selection' | 'menu' | 'popover' | 'sidebar' | 'medium-light' | 'ultra-dark' | 'appearance-based';

export interface IState {
    visible: boolean;
}

export interface IProps {
    onShow?: VoidFunction;
    title?: string;
    visible: boolean;
    icon?: string;
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    center?: boolean;
    animated?: boolean;
    movable?: boolean;
    resizable?: boolean;
    minimizable?: boolean;
    maximizable?: boolean;
    fullscreenable?: boolean;
    closable?: boolean;
    alwaysOnTop?: boolean;
    skipTaskbar?: boolean;
    windowState?: WindowState;
    macOsVibrancy?: MacOSVibrancy;
}

export default class BrowserWindow extends React.Component<IProps, IState> {

    private browserWindow: Electron.BrowserWindow;

    constructor(props: IProps) {
        super(props);
        this.state = { visible: props.visible };
    }

    onShow = (event: Electron.Event, command: string): void => {
        this.setState({ visible: true });
        if (this.props.onShow) {
            this.props.onShow();
        }
    }

    componentWillReceiveProps(nextProps: IProps): void {
        if (this.props.visible !== nextProps.visible) {
            this.setState({ visible: nextProps.visible });
        }
    }

    render(): JSX.Element | null {
        if (!this.browserWindow) {
            this.browserWindow = remote.getCurrentWindow();
        }

        this.browserWindow.removeAllListeners();

        if (this.state.visible === false) {
            this.browserWindow.on('show', this.onShow);
        } else {
            this.browserWindow.removeListener('show', this.onShow);
        }

        if (this.props.title) {
            this.browserWindow.setTitle(this.props.title);
        }

        if (this.props.icon) {
            this.browserWindow.setIcon(nativeImage.createFromPath(this.props.icon));
        }

        if (typeof this.props.left === 'number' && typeof this.props.top === 'number') {
            this.browserWindow.setPosition(this.props.left, this.props.top, this.props.animated);
        }

        if (this.props.width && this.props.height) {
            this.browserWindow.setSize(this.props.width, this.props.height, this.props.animated);
        }

        if (this.props.macOsVibrancy) {
            this.browserWindow.setVibrancy(this.props.macOsVibrancy);
        }

        switch (this.props.windowState) {
            case 'minimized':
                if (!this.browserWindow.isMinimized()) {

                    this.browserWindow.setKiosk(false);
                    this.browserWindow.setFullScreen(false);
                    this.browserWindow.minimize();
                }
                break;

            case 'maximized':
                if (!this.browserWindow.isMaximized()) {

                    this.browserWindow.setKiosk(false);
                    this.browserWindow.setFullScreen(false);
                    this.browserWindow.maximize();
                }
                break;

            case 'fullscreen':
                if (!this.browserWindow.isFullScreen()) {

                    this.browserWindow.setKiosk(false);
                    this.browserWindow.setFullScreen(true);
                }
                break;

            case 'kiosk':
                if (!this.browserWindow.isKiosk()) {

                    this.browserWindow.setFullScreen(false);
                    this.browserWindow.setKiosk(true);
                }

            case 'normal':
                break;

        }

        if (typeof this.props.resizable === 'boolean') {
            this.browserWindow.setResizable(this.props.resizable);
        }

        if (typeof this.props.movable === 'boolean') {
            this.browserWindow.setMovable(this.props.movable);
        }

        if (typeof this.props.minimizable === 'boolean') {
            this.browserWindow.setMinimizable(this.props.minimizable);
        }

        if (typeof this.props.maximizable === 'boolean') {
            this.browserWindow.setMaximizable(this.props.maximizable);
        }

        if (typeof this.props.fullscreenable === 'boolean') {
            this.browserWindow.setFullScreenable(this.props.fullscreenable);
        }

        if (typeof this.props.closable === 'boolean') {
            this.browserWindow.setClosable(this.props.closable);
        }

        if (typeof this.props.alwaysOnTop === 'boolean') {
            this.browserWindow.setAlwaysOnTop(this.props.alwaysOnTop);
        }

        if (typeof this.props.skipTaskbar === 'boolean') {
            this.browserWindow.setSkipTaskbar(this.props.skipTaskbar);
        }

        if (this.props.center) {
            this.browserWindow.center();
        }

        if (this.state.visible) {
            this.browserWindow.show();
        } else {
            this.browserWindow.hide();
        }

        return null;
    }

}
