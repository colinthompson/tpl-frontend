import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import * as stores from './stores';
//import * as actions from './actions/index';
import {useStrict} from 'mobx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/App';

import 'react-select/dist/react-select.css';

useStrict(true);
injectTapEventPlugin();

ReactDOM.render(
  <Provider { ...stores }>
    <Router history={browserHistory}>
      <Route path='/'>
        <IndexRedirect to="/home" />
        <Route path="home" component={App} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
