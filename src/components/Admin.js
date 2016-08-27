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
				<button className="ui blue button mini" onTouchTap={this.handleUpdateNicknames.bind()}>Update Nicknames</button>
				{ teamStore.allPlayersList.map(playerValue => 
					<div key={playerValue.playerId}>
						{playerValue.playerName}: 
						<input defaultValue={playerValue.nickname} onChange={this.handleNicknameChanged.bind(this, playerValue)}/>
						
					</div>          
		        )}
			</div>
		)
	}

	handleUpdateNicknames(){
		teamStore.updateTeams();
	}

	handleNicknameChanged(playerValue, event) {
		playerValue.setNickname(event.target.value);
	}

}

export default Admin;
