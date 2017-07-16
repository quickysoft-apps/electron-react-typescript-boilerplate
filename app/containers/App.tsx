import * as React from 'react';
import withLayout from '../hocs/withLayout'

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default withLayout('Yakapa', App);
