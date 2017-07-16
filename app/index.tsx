import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { grey900 } from 'material-ui/styles/colors'

const { configureStore, history } = require('./store/configureStore');
const store = configureStore();

document.body.style.position = "relative";
document.body.style.height = "100vh";
document.body.style.overflowY = "hidden";
document.body.style.backgroundColor = grey900;
document.body.style.margin = "0px";

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if ((module as any).hot) {
  (module as any).hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
