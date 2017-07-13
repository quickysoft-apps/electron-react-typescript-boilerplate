import * as React from 'react';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui'

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div data-tid="container">
          <h2>Yakapa 0.4.0</h2>
          <FlatButton>
            <Link to="/counter">to Counter</Link>
          </FlatButton>
        </div>
      </div>
    );
  }
}
