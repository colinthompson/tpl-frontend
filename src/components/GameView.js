import React from 'react';
import { observer, inject } from 'mobx-react';
//import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';

@inject('gameStore') @observer
class GameView extends React.Component {

  render() {
    const centerContainer = {maxWidth: 400, margin: '0 2px 2px'};
    
    const { gameStore } = this.props;
    
    //leagueStore.getPlayersByTeam(gameStore.getTeamId());
    //leagueStore.getPlayersNotOnTeam(gameStore.getTeamId());
    
    return (
      <div style={centerContainer}>
        <h1>EVENTS</h1>
        {
          gameStore.getEventsList().map(event =>
            <div key={event.sequence}>
                {event.player.nickname} - {event.eventType}
            </div>
          )
        }
        <h1>PLAYERS ON TEAM</h1>
        {
          gameStore.getTrackingList().map(player =>
            <div key={player.id}>
              {player.nickname}
            </div>
          )
        }
        <h1>SUBS FOR TEAM</h1>
        {
          gameStore.getSubList().map(player =>
            <div key={player.id}>
              {player.nickname}
            </div>
          )
        }
      </div>
    )
  }
}

export default GameView;
