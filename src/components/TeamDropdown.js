import React, { Component } from 'react';
import Dropdown from 'react-dropdown'
import { action } from 'mobx';
import { observer } from 'mobx-react';

@observer
class TeamDropdown extends Component {

	render() {
		const { teams, selectedTeam } = this.props;	  	
    	return (
    		<div>
    			<Dropdown options={teams} onChange={this.onTeamChange} value={selectedTeam} placeholder="Select a team" />
    		</div>
    	)
  	}

  	@action onTeamChange = (e) => {
  		this.props.teamStore.selectedTeam = e.value;
  	}
}

export default TeamDropdown;