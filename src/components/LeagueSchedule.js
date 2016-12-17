import React from 'react';
import { observer, inject } from 'mobx-react';
//import * as actions from '../actions/index';

@inject('sessionStore', 'leagueStore') @observer
class LeagueSchedule extends React.Component {
  
  render() {

    const { sessionStore, leagueStore } = this.props;

    const games = leagueStore.getGamesList();

    

    if (sessionStore.getTrackStatsMode()){
      return (
        <div>
          <div>Schedule - Track Stats Mode</div>
          {
            games.map(game =>
              <div key={game.id} >
                {game.homeTeam} vs {game.awayTeam} - {game.id}
              </div>
            )
          }
        </div>
      )
    }

    if (sessionStore.getViewResultsMode()){
      return (
        <div>
          <div>Schedule - View Results Mode</div>
          {
            games.map(game =>
              <div key={game.id} >
                {game.homeTeam} vs {game.awayTeam} - {game.id}
              </div>
            )
          }
        </div>
      )
    }

  }

  handleOnTouchTap(teamIdValue, gameIdValue, event){  
     this.props.onTeamChange(teamIdValue, gameIdValue);
  }

}


export default LeagueSchedule;

