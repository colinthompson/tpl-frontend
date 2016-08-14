import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import TeamDropdown from './TeamDropdown.js';
import PlayersList from './PlayersList.js';

@observer
class Main extends Component {

	componentWillMount() {
		this.props.teamStore.loadTeams();
	}

	render() {
		const { teamStore } = this.props;

		return (
			<div>
				{ teamStore.selectedTeam === '' ?
					<TeamDropdown teamStore={teamStore} teams={ teamStore.teamsDropDownArray } selectedTeam={ teamStore.selectedTeam} />  :
					<div>
						<div onClick={this.clearSelectedTeam}>Reset</div>
						<PlayersList players={ teamStore.playersList } />
					</div>
				}	
			</div>
		)
	}

	@action clearSelectedTeam = () => {
  		this.props.teamStore.selectedTeam = '';
  	}

}

export default Main;