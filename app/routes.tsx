import * as React from 'react';
import { Switch, Route } from 'react-router';
import AppPage from './containers/AppPage';
import HomePage from './containers/HomePage';
import ConfigurationPage from './containers/ConfigurationPage';
import JobManagerPage from './containers/JobManagerPage';
import CounterPage from './containers/CounterPage';

export default () => (
  <AppPage>
    <Switch>
      <Route path="/counter" component={CounterPage} />      
      <Route path="/configuration" component={ConfigurationPage} />
      <Route path="/jobManager" component={JobManagerPage} />
      <Route path="/" component={HomePage} />      
    </Switch>
  </AppPage>
);
