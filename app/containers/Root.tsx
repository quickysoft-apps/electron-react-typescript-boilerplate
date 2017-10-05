import * as React from "react";
const injectTapEventPlugin:any = require("react-tap-event-plugin");
injectTapEventPlugin();

import * as Redux from "react-redux";
import { History } from "history";

import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import Routes from "../routes";

import { MuiThemeProvider } from "material-ui/styles";
import getTheme from "../theme";

interface IRootType {
  store: Redux.Store<any>;
  history: History;
}

export default function Root({ store, history }: IRootType):JSX.Element {
  return (
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getTheme()}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  );
}
