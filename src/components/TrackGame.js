import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
import { DropDownMenu, MenuItem } from "material-ui";
import { observer } from 'mobx-react';
import { action } from 'mobx';
import PlayersList from './PlayersList.js';
import Scoreboard from './Scoreboard.js';
import { TeamStore } from '../stores/team-store';

const muiTheme = getMuiTheme({
	palette: {
		accent1Color: deepOrange500
	}
});

const teamStore = new TeamStore();

@observer
class TrackGame extends Component {

	componentWillMount() {
		teamStore.loadTeams();
	}

	render() {

		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					{ teamStore.selectedTeam === '' ?
						<SelectTeam onTeamChange={this.onTeamChange} teamsMenuItems={teamStore.teamsMenuItems} />  :
						<ShowTeam teamStore={teamStore} playersList={teamStore.trackingPlayersArray} subsList={teamStore.subPlayersArray} gameLog={teamStore.gameLogList} />
					}	
				</div>
			</MuiThemeProvider>
		)
	}

	@action clearSelectedTeam = () => {
  		teamStore.resetToMain();
  	}

	@action onTeamChange = (event, index, value) => {
		teamStore.selectTeam(value);
	}

}

const SelectTeam = (props) =>	(<DropDownMenu
  										value=''
  										style={{width: "100%"}}
  										onChange={props.onTeamChange} >
  											<MenuItem
  												value=''
  												key='key-0'
  												primaryText='Select Team' />
  											{props.teamsMenuItems}
  									</DropDownMenu>);
const ShowTeam = (props) =>		(<div className="ui grid container">
									<Scoreboard gameLog={props.gameLog} />
									<PlayersList teamStore={ props.teamStore } players={ props.playersList } subs={props.subsList} />
								</div>);

export default TrackGame;