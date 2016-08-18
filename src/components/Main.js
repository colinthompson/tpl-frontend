import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import { DropDownMenu, MenuItem } from "material-ui";
import { observer } from 'mobx-react';
import { action } from 'mobx';
import PlayersList from './PlayersList.js';
import Scoreboard from './Scoreboard.js';

const muiTheme = getMuiTheme({
	palette: {
		accent1Color: deepOrange500
	}
});

@observer
class Main extends Component {

	componentWillMount() {
		this.props.teamStore.loadTeams();
	}

	render() {
		const { teamStore } = this.props;

		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					{ teamStore.selectedTeam === '' ?
						<SelectTeam onTeamChange={this.onTeamChange} teamsMenuItems={teamStore.teamsMenuItems} />  :
						<ShowTeam teamStore={teamStore} clearSelectedTeam={this.clearSelectedTeam} playersList={teamStore.trackingPlayersArray} subsList={teamStore.subPlayersArray} gameLog={teamStore.gameLogList} />
					}	
				</div>
			</MuiThemeProvider>
		)
	}

	@action clearSelectedTeam = () => {
  		this.props.teamStore.resetToMain();
  	}

	@action onTeamChange = (event, index, value) => {
		this.props.teamStore.selectTeam(value);
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
const ShowTeam = (props) =>		(<div>
									<RaisedButton onTouchTap={props.clearSelectedTeam} label="Reset" fullWidth={true} />
                  					<Scoreboard gameLog={props.gameLog} />
									<PlayersList teamStore={ props.teamStore } players={ props.playersList } subs={props.subsList} />
								</div>);

export default Main;