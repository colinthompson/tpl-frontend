import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import * as actions from '../actions/index';
import SelectSub from './SelectSub';
import GameTeamStats from './GameTeamStats';
import GameTeamChart from './GameTeamChart';

@inject('sessionStore', 'gameStore') @observer
class GameTeamView extends React.Component {

  componentDidMount() {
    const {sessionStore} = this.props;
    if (!sessionStore.getProvidedInstructions()) {
      sessionStore.setProvidedInstructions(true);
      alert('Select "Setup Players / Subs" from the menu to prepare your game.');
    }
  }

  handleTapPlayer(playerId) {
    actions.tapPlayerButton(playerId);
  }

  handleTapEvent(event) {
    actions.setEventType(event);
  }

  handleUndoEvent() {
    actions.undoEvent();
  }

  render() {
    
    const { gameStore } = this.props;

    const gameEvents = gameStore.getEventsList().slice(-5);
    const trackingList = gameStore.getTrackingList();
    const isEditPlayerMode = gameStore.getEditPlayerMode();
    const playerIdToDisable = gameStore.getPlayerIdToDisable();
    const teamScore = gameStore.getTeamScore();
    const isScoreboardMode = gameStore.getScoreboardMode();

    if (isScoreboardMode) {
      return (
        <Grid fluid={true}>
          <Col xs={12} md={6} mdOffset={3}>
            <GameTeamStats />
          </Col>
          <Col xs={12} md={6} mdOffset={3} className="gameChart">
            <GameTeamChart />
          </Col>
        </Grid>
      );
    }

    return (
      <Grid fluid={true}>
        
        <ShowTeamScore isEditPlayerMode={isEditPlayerMode} teamScore={teamScore} />

        <ShowEventsLog isEditPlayerMode={isEditPlayerMode} gameEvents={gameEvents} />

        <ShowEventButtons isEditPlayerMode={isEditPlayerMode} handleTapEvent={this.handleTapEvent} handleUndoEvent={this.handleUndoEvent} teamScore={teamScore} />

        <ShowSelectSubs isEditPlayerMode={isEditPlayerMode} />

        <ShowTrackingPlayers 
          isEditPlayerMode={isEditPlayerMode} 
          trackingList={trackingList}
          handleTapPlayer={this.handleTapPlayer}
          playerIdToDisable={playerIdToDisable}
          />

      </Grid>
    )
  }
}

/* Team Score */

function ShowTeamScore(props) {
  const {isEditPlayerMode, teamScore} = props;
  if (isEditPlayerMode) {
    return (
      <div></div>
    );
  }
  return (
    <Row>
      <Col xs={12} md={6} mdOffset={3}>
        Score: {teamScore}
      </Col>
    </Row>
  );
}

/* Event Log Container */

function ShowEventsLog(props) {
  const {gameEvents, isEditPlayerMode} = props;
  if (isEditPlayerMode) {
    return (
      <div></div>
    );
  }
  return (
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

/* Event Buttons */

function ShowEventButtons(props) {
  const {isEditPlayerMode, handleTapEvent, handleUndoEvent} = props;
  if (isEditPlayerMode) {
    return (
      <div></div>
    );
  }
  return(
    <Row>
      <Col xs={2} md={1} mdOffset={3} className="eventButtonContainer">
          <Button onClick={() => handleTapEvent('Goal')} block bsSize="small" bsStyle={null} className="btn-event">Goal</Button>
      </Col>
      <Col xs={2} md={1} className="eventButtonContainer">
          <Button onClick={() => handleTapEvent('Drop')} block bsSize="small" bsStyle={null} className="btn-event">Drop</Button>
      </Col>    
      <Col xs={2} md={1} className="eventButtonContainer">
          <Button onClick={() => handleTapEvent('TA')} block bsSize="small" bsStyle={null} className="btn-event">TA</Button>
      </Col>    
      <Col xs={2} md={1} className="eventButtonContainer">
          <Button onClick={() => handleTapEvent('D')} block bsSize="small" bsStyle={null} className="btn-event">D</Button>
      </Col>    
      <Col xs={2} md={1} className="eventButtonContainer">
          <Button onClick={() => handleUndoEvent()} block bsSize="small" bsStyle={null} className="btn-undo">Undo</Button>
      </Col>  
    </Row>
  );
}

/* Select Subs */

function ShowSelectSubs(props) {
  const {isEditPlayerMode} = props;
  if (!isEditPlayerMode) {
    return (
      <div></div>
    );
  }
  return (
    <Row>
      <Col xs={12} md={6} mdOffset={3} className="text-center">
        <SelectSub />
      </Col>
    </Row>
  );
}

/* Tracking Players */

function ShowTrackingPlayers(props) {
  const {isEditPlayerMode, handleTapPlayer, trackingList, playerIdToDisable } = props;

  return (
    <Row>
      <Col xs={12} md={6} mdOffset={3}>
        <div className="masonry2">
          {
            trackingList.map(player =>
              <div key={player.id} className="item">
                <PlayerButton 
                  player={player}
                  onTapPlayer={handleTapPlayer}
                  isEditPlayerMode={isEditPlayerMode}
                  playerIdToDisable={playerIdToDisable}
                  />
              </div>
            )
          }
        </div>
      </Col>
      
    </Row>
  );
}

function PlayerButton(props) {

  const {player, onTapPlayer, isEditPlayerMode, playerIdToDisable} = props;

  const disabled = (player.id === playerIdToDisable ? true : false);
  const buttonClass = (disabled ? 
                        "btn-disabled btn-text" : 
                        (player.gender === "Male" ? 
                          "btn-male btn-text" : 
                          "btn-female btn-text"));

  return (
    <Button 
      bsStyle={null}
      className={buttonClass}
      bsSize="small" 
      block
      disabled={disabled}
      onClick={() => onTapPlayer(player.id)}
    >
      { isEditPlayerMode ? <Glyphicon className="remove-icon" glyph="remove" /> : ""}
      { player.nickname }
    </Button>

  );
}

export default GameTeamView;
