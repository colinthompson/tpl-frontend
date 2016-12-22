import React from 'react';
import { observer, inject } from 'mobx-react';
//import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';
import SelectSub from './SelectSub';


@inject('gameStore') @observer
class GameView extends React.Component {

  render() {
    
    const { gameStore } = this.props;
    
    return (
      <div>
        <SelectSub />
        <h1>PLAYERS ON TEAM</h1>
        {
          gameStore.getTrackingList().map(player =>
            <div key={player.id}>
              {player.nickname} - {player.gender}
            </div>
          )
        }
        <h1>SUBS FOR TEAM</h1>
        {
          gameStore.getSubList().map(player =>
            <div key={player.id}>
              {player.nickname} - {player.gender}
            </div>
          )
        }

        <h1>EVENTS</h1>
        {
          gameStore.getEventsList().map(event =>
            <div key={event.sequence}>
                {event.sequence} - {event.player.nickname} - {event.eventType}
            </div>
          )
        }
      </div>
    )
  }
}

export default GameView;
