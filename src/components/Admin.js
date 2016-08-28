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
			<div className="ui grid container">
				<div className="sixteen wide column">
        			<button className="ui blue button mini" onTouchTap={this.handleUpdateNicknames.bind()}>Update Nicknames</button>
				</div>

				{ teamStore.allPlayersList.map(playerValue => 
					<div className="row" key={playerValue.playerId}>
						<div className="six wide column">
							{playerValue.playerName}
						</div>
						<div className="ten wide column"> 
							<input defaultValue={playerValue.nickname} onChange={this.handleNicknameChanged.bind(this, playerValue)}/>
						</div>
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
