import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TeamStore } from '../stores/team-store';


const teamStore = new TeamStore();

@observer
class Admin extends Component {

	componentWillMount() {
		teamStore.loadTeams();
	}

	render() {

		return (
			<div>
				{ teamStore.allPlayersList.map(playerValue => 
					<div key={playerValue.playerId}>
						{playerValue.playerName}:
						<input defaultValue={playerValue.nickname} onChange={this.handleNicknameChanged.bind(this, playerValue)}/>
						<button 
							className="ui blue button mini"
							onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}>
								Update Nickname
						</button>
					</div>          
		        )}
			</div>
		)
	}

	handleOnTouchTap(playerValue, event){
		console.log(playerValue.nickname);
	}

	handleNicknameChanged(playerValue, event) {
		playerValue.setNickname(event.target.value);
	}

}

export default Admin;
