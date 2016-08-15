import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import { DropDownMenu, MenuItem } from "material-ui";
import { observer } from 'mobx-react';
import { action } from 'mobx';
import PlayersList from './PlayersList.js';

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
						<ShowTeam clearSelectedTeam={this.clearSelectedTeam} playersList={teamStore.playersList} />
					}	
				</div>
			</MuiThemeProvider>
		)
	}

	@action clearSelectedTeam = () => {
  		this.props.teamStore.selectedTeam = '';
  	}

  	@action onTeamChange = (event, index, value) => {
  		this.props.teamStore.selectedTeam = value;
  	}

}

const SelectTeam = (props) =>	(<DropDownMenu
  										value=''
  										style={{width: "40%"}}
  										onChange={props.onTeamChange} >
  											<MenuItem
  												value=''
  												key='key-0'
  												primaryText='Select Team' />
  											{props.teamsMenuItems}
  									</DropDownMenu>);
const ShowTeam = (props) =>		(<div>
									<RaisedButton onTouchTap={props.clearSelectedTeam} label="Reset" fullWidth={true} />
									<PlayersList players={ props.playersList } />
								</div>);

export default Main;