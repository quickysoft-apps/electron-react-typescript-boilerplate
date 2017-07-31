import * as React from 'react';
import { Switch, Route } from 'react-router';
import AppPage from './containers/AppPage';
import HomePage from './containers/HomePage';
import AssociationPage from './containers/AssociationPage';
import CounterPage from './containers/CounterPage';

export default () => (
  <AppPage>
    <Switch>
      <Route path="/counter" component={CounterPage} />      
      <Route path="/association" component={AssociationPage} />
      <Route path="/" component={HomePage} />      
    </Switch>
  </AppPage>
);
