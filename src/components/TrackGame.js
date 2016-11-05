import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
//import { DropDownMenu, MenuItem } from "material-ui";
import { observer } from 'mobx-react';
import { action } from 'mobx';
import PlayersList from './PlayersList.js';
import Scoreboard from './Scoreboard.js';
import LeagueSchedule from './LeagueSchedule.js';
import GameStatistics from './GameStatistics.js';
import { TeamStore } from '../stores/team-store';
import DevTools from 'mobx-react-devtools';

const muiTheme = getMuiTheme({
	palette: {
		accent1Color: deepOrange500
	}
});

const teamStore = new TeamStore();

@observer
class TrackGame extends Component {

	componentWillMount() {
		const { params } = this.props;
		const leagueId = params.leagueId;
		teamStore.loadTeams(leagueId);
		teamStore.loadGames(leagueId);
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
				<DevTools />
					{ teamStore.selectedTeam === '' ?
						<LeagueSchedule teams={teamStore.scheduleGamesArray}  onTeamChange={this.onTeamChange} />  :
						<ShowTeam teamStore={teamStore} playersList={teamStore.trackingPlayersArray} subsList={teamStore.subPlayersArray} gameLog={teamStore.gameLogList} removeMode={teamStore.removeMode} teamName={teamStore.selectedTeamName} teamScore={teamStore.teamScore} opponentScore={teamStore.opponentScore} viewStatsMode={teamStore.viewStatsMode} onReturn={this.onReturn} />
					}	
				</div>
			</MuiThemeProvider>
		)
	}

	@action clearSelectedTeam = () => {
  		teamStore.resetToMain();
  	}

	@action onTeamChange = (teamIdValue, gameIdValue) => {
		teamStore.selectTeam(teamIdValue, gameIdValue);
	}

	@action onReturn = () => {
		teamStore.setViewStatsMode(false);
	}

}
/*
{ teamStore.selectedTeam === '' ?
						<SelectTeam onTeamChange={this.onTeamChange} teamsMenuItems={teamStore.teamsMenuItems} />  :
						<ShowTeam teamStore={teamStore} playersList={teamStore.trackingPlayersArray} subsList={teamStore.subPlayersArray} gameLog={teamStore.gameLogList} />
					}*/
/*
const SelectTeam = (props) =>	(<DropDownMenu
  										value=''
  										style={{width: "100%"}}
  										onChange={props.onTeamChange} >
  											<MenuItem
  												value=''
  												key='key-0'
  												primaryText='Select Team' />
  											{props.teamsMenuItems}
  									</DropDownMenu>); */

									  //GameStatistics doesn't need viewStatsMode... nor should it need the whole teamstore'
const ShowTeam = (props) =>		(	teamStore.viewStatsMode === true ?
									<GameStatistics viewStatsMode={props.viewStatsMode} teamStore={ props.teamStore } onReturn={props.onReturn} /> :
									<div className="ui grid container">
										<Scoreboard gameLog={props.gameLog} teamName={props.teamName} teamScore={props.teamScore} opponentScore={props.opponentScore} />
										<PlayersList teamStore={ props.teamStore } players={ props.playersList } subs={props.subsList} removeMode={props.removeMode} onReturn={props.onReturn} />
									</div> 
									
								);


export default TrackGame;