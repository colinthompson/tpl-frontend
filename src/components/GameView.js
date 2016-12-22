import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';
import SelectSub from './SelectSub';


@inject('gameStore') @observer
class GameView extends React.Component {

  handleTapPlayer(playerId) {
    console.log("tapped on playerid: " + playerId);
  }

  render() {
    
    const { gameStore } = this.props;
    
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={6} mdOffset={3} className="text-center">
            <SelectSub />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6} mdOffset={3}>
            <div  className="masonry">
              {
                gameStore.getTrackingList().map(player =>
                  <div key={player.id} className="item">
                    <PlayerButton 
                      player={player}
                      onTapPlayer={this.handleTapPlayer}
                      />
                  </div>
                )
              }
            </div>
          </Col>
        </Row>

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
      </Grid>
    )
  }
}

function PlayerButton(props) {

  const {player, onTapPlayer} = props

  const disabled = (player.id==='38869' ? true : false);
  console.log(player.id)
  console.log(disabled)

  return (
  
    <Button 
      bsStyle={player.gender === "Male" ? "info" : "warning"} 
      bsSize="small" 
      disabled={disabled}
      onClick={() => onTapPlayer(player.id)}
    >
        {player.nickname} - {player.id} - {player.gender}
    </Button>

  );
}

//<Button bsStyle="info" bsSize="small" block onClick={() => this.handleTapPlayer(player.id)}>{player.nickname} - {player.id}</Button>
export default GameView;
