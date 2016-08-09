import React, { Component } from 'react';
import TeamDropdown from './TeamDropdown.js'

//const teamDataURL = '//tuc-tpl.herokuapp.com/teams';

class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			teams: []
		}
	}

	componentDidMount() {
		// this is where we make the .getJSON call to get the teams from the URL
		console.log("this is where we make the .getJSON call to get the teams from the URL");

		
		this.setState({
			teams: [
				{ value: '123', label: 'TEAM 123'},
				{ value: '456', label: 'TEAM 456'}
			]
		});
	}

	teamChanged(teamObject) {
		console.log(teamObject);
	}

	render() {
		return (
			<div>
				<TeamDropdown teamChanged={this.teamChanged} teams={this.state.teams} />
			</div>
		)
	}


}

export default Main;