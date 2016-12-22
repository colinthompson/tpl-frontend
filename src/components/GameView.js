import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
//import * as actions from '../actions/index';
import SelectSub from './SelectSub';


@inject('gameStore') @observer
class GameView extends React.Component {

  handleTapPlayer(playerId) {
    console.log("tapped on playerid: " + playerId);
  }

  render() {
    
    const { gameStore } = this.props;

    const gameEvents = gameStore.getEventsList().slice(-5);
    
    return (
      <Grid fluid={true}>
        
        <Row>
          <Col xs={12} md={6} mdOffset={3}>
            <div className="eventsLog">
              {
                gameEvents.map(event =>
                  <EventBox event={event} key={event.sequence} />
                )
              }
            </div>
          </Col>

        </Row>

        <Row>
          <Col xs={12} md={6} mdOffset={3} className="text-center">
            <SelectSub />
          </Col>
        </Row>
        

        <Row>
          <Col xs={8} md={4} mdOffset={3}>
            <div className="masonry2">
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
          <Col xs={4} md={2}>
            <div className="masonry1">
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">Goal</Button>
              </div>
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">Drop</Button>
              </div>
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">TA</Button>
              </div>
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">D</Button>
              </div>
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">Undo</Button>
              </div>
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">+</Button>
              </div>
              <div className="item">
                <Button block bsSize="small" bsStyle={null} className="btn-event">-</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function PlayerButton(props) {

  const {player, onTapPlayer} = props;

  const disabled = ((player.id==='38135' || player.id==='38869') ? true : false);
  const buttonClass = (player.gender === "Male" ? "btn-male btn-text" : "btn-female btn-text");

  return (
  
    <Button 
      bsStyle={null}
      className={buttonClass}
      bsSize="small" 
      block
      disabled={disabled}
      onClick={() => onTapPlayer(player.id)}
    >
        {player.nickname}
    </Button>

  );
}

function EventBox(props) {

  const {event} = props;

  const glyphClass = (event.player.gender === "Male" ? "event-male" : "event-female");

  return (
    <div className="eventBox">
      <Glyphicon className={glyphClass} glyph="user" />{event.player.nickname}<br />{event.eventType}
    </div>
  );
}

export default GameView;
