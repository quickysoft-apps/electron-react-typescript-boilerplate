import * as React from 'react';
import { Switch, Route } from 'react-router';
import AppPage from './containers/AppPage';
import HomePage from './containers/HomePage';
import ConfigurationPage from './containers/ConfigurationPage';
import JobManagerPage from './containers/JobManagerPage';
import JobRunnerPage from './containers/JobRunnerPage';
import JobHistoryPage from './containers/JobHistoryPage';

export default (): JSX.Element => (
  <AppPage>
    <Switch>
      <Route path="/configuration" component={ConfigurationPage} />
      <Route path="/jobManager" component={JobManagerPage} />
      <Route path="/jobRunner" component={JobRunnerPage} />
      <Route path="/jobHistory" component={JobHistoryPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </AppPage>
);
