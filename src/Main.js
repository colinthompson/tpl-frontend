import React, { Component } from 'react';
import TeamDropdown from './TeamDropdown.js';
import PlayersList from './PlayersList.js';

const teamDataURL = '//tuc-tpl.herokuapp.com/teams';

class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			teams: [],
			players: [],
			selectedTeam: ''
		}
		this.teamChanged = this.teamChanged.bind(this);
		this.clearSelectedTeam = this.clearSelectedTeam.bind(this);
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
						teamId: val.id,
						gender: p.gender,
						playerName: p.playerName,
						nickname: p.nickname,
						id: p.id
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
		this.setState({ selectedTeam: teamObject.value })
	}

	clearSelectedTeam() {
		this.setState({ selectedTeam: ''})
	}

	render() {
		const filteredPlayers = this.state.players.filter(player => (player.teamId === this.state.selectedTeam));
		return (
			<div>
				{ this.state.selectedTeam === '' ?
					<SelectTeam teamChanged={this.teamChanged} teams={this.state.teams} />  :
					<ShowTeam clearTeam={this.clearSelectedTeam} players={filteredPlayers} />
				}
			</div>
		)
	}

}

const SelectTeam = (props) => <TeamDropdown teamChanged={props.teamChanged} teams={props.teams} />;
const ShowTeam = (props) => (<div>
															<div onClick={props.clearTeam}>Select New Team</div>
															<PlayersList players={ props.players } />
														</div>);


export default Main;