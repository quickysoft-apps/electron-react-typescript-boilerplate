import * as React from 'react';
import { AppBar } from 'material-ui'

export default function withLayout<P = {}>(title: string, Component: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P> {
  return class WithLayout extends React.Component<P, {}> {
    public render() {
      return (
        <div>
          <AppBar title={title} />
          <Component {...this.props} />
        </div >
      );
    }
  }
};

