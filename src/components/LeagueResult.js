import React, { Component } from 'react';
import { TeamStore } from '../stores/team-store';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import GameStatistics from './GameStatistics.js';
import DevTools from 'mobx-react-devtools';
import LeagueSchedule from './LeagueSchedule.js';


const teamStore = new TeamStore();

@observer
class LeagueResult extends Component {
  
  componentWillMount() {
    const { params } = this.props;
    const leagueId = params.leagueId;
    teamStore.loadTeams(leagueId);
    teamStore.loadGames(leagueId);
  }

  render() {

    return (

        <div className="ui grid container">
        <DevTools />
        { teamStore.selectedTeam === '' && teamStore.viewStatsMode === false ?
            <LeagueSchedule teams={teamStore.scheduleGamesArray}  onTeamChange={this.onTeamChange} />  : 
			<ShowStatistics teamStore={teamStore} viewStatsMode={teamStore.viewStatsMode} onReturn={this.onReturn} />
		}	
        </div>

    )
  }


  @action onTeamChange = (teamIdValue, gameIdValue) => {
    teamStore.setViewStatsMode(true);
	teamStore.selectTeam(teamIdValue, gameIdValue);
  }

  @action onReturn = () => {
      teamStore.setViewStatsMode(false);
      teamStore.selectTeam('','');
  }


}



LeagueResult.propTypes = {
  teams: React.PropTypes.array
};

LeagueResult.defaultProps = {
  teams: []
};

const ShowStatistics = (props) =>		(	teamStore.viewStatsMode === true ?
									<GameStatistics viewStatsMode={props.viewStatsMode} teamStore={ props.teamStore} onReturn={props.onReturn} /> :
									<div className="ui grid container">
                                        NOTHING
									</div> 									
								);

export default LeagueResult;

