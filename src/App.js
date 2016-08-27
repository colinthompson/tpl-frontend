import React, { Component } from 'react';
import Main from './components/Main.js';
import TrackGame from './components/TrackGame.js';
import Admin from './components/Admin.js';
import { Router, Route, hashHistory } from 'react-router';
import './www/style/App.css';

class App extends Component {

  render() {

  	return (
  		<Router history={hashHistory}>
  			<Route path="/" component={Main} />				
  			<Route path="trackGame" component={TrackGame} />
  			<Route path="admin" component={Admin} />
  		</Router>
  	)
	

  }

}

export default App;
