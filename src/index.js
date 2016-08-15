import React from 'react';
import {render} from 'react-dom';
import {useStrict} from 'mobx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import './www/style/index.css';

useStrict(true);

//Needed for onTouchTap
injectTapEventPlugin();

render(
  <App />,
  document.getElementById('root')
);
