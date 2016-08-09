import React, { Component } from 'react';
import TeamDropdown from './TeamDropdown.js'

const teamDataURL = '//tuc-tpl.herokuapp.com/teams';

class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			teams: [],
			players: []
		}
	}

	componentDidMount() {
		fetch(teamDataURL, { method: 'get' })
			.then(response => response.json())
			.then(responseJson => {

				// [TODO] Clear state of teams and players?

				// Map the response into a teams array -- set the state; used to build dropdown
				const teamsArray = responseJson.map(val => {

					// Map each player in each team into a players array -- set the state; used to build roster
					const playerArray = val.players.map(p => ({
						teamName: val.teamName,
						gender: p.gender,
						playerName: p.playerName,
						nickname: p.nickname
					}));

					// Concatenate players from each team to the state
					this.setState({
						players: this.state.players.concat(playerArray)
					});
					
					// Returning the team data
					return {	value: val.id,	label: val.teamName	}
				});

				this.setState({
					teams: teamsArray
				});

			})
			.catch(err => {
				console.log(err);
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