import React, { Component } from 'react';
import './www/style/App.css';
import { observer } from 'mobx-react';
import Main from './Main.js'

@observer
class App extends Component {
  render() {
    return <Main />;
  }
}

export default App;
