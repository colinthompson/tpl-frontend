import React from 'react';
import { observer, inject } from 'mobx-react';
//import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';

@inject('gameStore') @observer
class GameView extends React.Component {

  render() {
    const centerContainer = {maxWidth: 400, margin: '0 2px 2px'};
    
    const { gameStore } = this.props;
    
    return (
      <div style={centerContainer}>
        {
          gameStore.getEventsList().map(event =>
            <div key={event.sequence}>
                {event.player.nickname} - {event.eventType}
            </div>
          )
        }
      </div>
    )
  }
}

export default GameView;
