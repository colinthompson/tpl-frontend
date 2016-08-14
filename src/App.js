import React, { Component } from 'react';
import Main from './components/Main.js'
import { TeamStore } from './stores/team-store';
import './www/style/App.css';

const teamStore = new TeamStore();

class App extends Component {
  render() {
    return <Main teamStore={teamStore} />;
  }
}

export default App;
