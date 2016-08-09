import React, { Component } from 'react';
import Dropdown from 'react-dropdown'

class TeamDropdown extends Component {

	render() {
		const { teams, teamChanged } = this.props;	  	
    	return (
    		<div>
    			<h3>Teams</h3>
    			<Dropdown options={teams} onChange={teamChanged} placeholder="Select a team" />
    		</div>
    	)
  	}
}

TeamDropdown.propTypes = {
	teamChanged: React.PropTypes.func.isRequired
};

TeamDropdown.defaultProps = {
	teams: []
};

export default TeamDropdown;