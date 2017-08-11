import * as React from 'react';
import { Switch, Route } from 'react-router';
import AppPage from './containers/AppPage';
import HomePage from './containers/HomePage';
import ConfigurationPage from './containers/ConfigurationPage';
import ScriptRunnerPage from './containers/ScriptRunnerPage';
import CounterPage from './containers/CounterPage';

export default () => (
  <AppPage>
    <Switch>
      <Route path="/counter" component={CounterPage} />      
      <Route path="/configuration" component={ConfigurationPage} />
      <Route path="/scriptRunner" component={ScriptRunnerPage} />
      <Route path="/" component={HomePage} />      
    </Switch>
  </AppPage>
);
