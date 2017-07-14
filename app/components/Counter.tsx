import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { FlatButton } from 'material-ui'

//let styles = require('./Counter.scss');

export interface IProps extends RouteComponentProps<any> {
  increment(): void,
  incrementIfOdd(): void,
  incrementAsync(): void,
  decrement(): void,
  counter: number
}

export class Counter extends React.Component<IProps> {
  render() {    
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    return (
      <div>
        <FlatButton>
          <Link to="/">Back</Link>          
        </FlatButton>
        <div data-tid="counter">
          {counter}
        </div>
        <div>
          <button onClick={increment} data-tclass="btn">
            <i className="fa fa-plus" />
          </button>
          <button onClick={decrement} data-tclass="btn">
            <i className="fa fa-minus" />
          </button>
          <button onClick={incrementIfOdd} data-tclass="btn">odd</button>
          <button onClick={() => incrementAsync()} data-tclass="btn">async</button>
        </div>
      </div>
    );
  }
}

export default Counter;
