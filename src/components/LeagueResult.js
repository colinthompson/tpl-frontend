import React, { Component } from 'react';
import { TeamStore } from '../stores/team-store';
import { observer } from 'mobx-react';
import GameStatistics from './GameStatistics.js';

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

    const teams = teamStore.scheduleGamesArray;

    return (

        <div className="ui grid container">
        { teamStore.selectedTeam === '' && teamStore.viewStatsMode === false ?
            <div className="ui grid container">
            { teams.map(teamValue =>
                <div key={teamValue.gameId} className="row">
                    <div className="six wide column">
                    {teamValue.date}
                    </div>
                    <div className="five wide column">
                    <button className="ui blue button small playerButton fluid"
                        onTouchTap={this.handleOnTouchTap.bind(this, teamValue.homeTeamId, teamValue.gameId)}>
                        {teamValue.homeTeam}
                    </button>
                    </div>
                    <div className="five wide column">
                    <button className="ui pink button small playerButton fluid"
                        onTouchTap={this.handleOnTouchTap.bind(this, teamValue.awayTeamId, teamValue.gameId)}>
                        {teamValue.awayTeam}
                    </button>
                    </div>
                </div>
            )}
            </div>  
            :
			<GameStatistics viewStatsMode={teamStore.viewStatsMode} teamStore={ teamStore }/>
		}	
        </div>

    )
  }

  handleOnTouchTap(teamIdValue, gameIdValue, event){  
     teamStore.selectTeam(teamIdValue, gameIdValue);
  }



}

LeagueResult.propTypes = {
  teams: React.PropTypes.array
};

LeagueResult.defaultProps = {
  teams: []
};

export default LeagueResult;

