import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button, Glyphicon, Table } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';
import * as actions from '../actions/index';
import SelectSub from './SelectSub';



@inject('sessionStore', 'gameStore') @observer
class GameView extends React.Component {

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
      const statisticsData = gameStore.getStatistics();
      const chartData = gameStore.getChartData();
      return (
        <Grid fluid={true}>
          <ShowScorebord statisticsData={statisticsData} />
          <ShowChart chartData={chartData} />
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

/* Scoreboard */

function ShowScorebord(props) {
  const {statisticsData} = props;

  return (
    <Col xs={12} md={6} mdOffset={3}>
      <Table responsive striped condensed>
        <thead>
          <tr>
            <th>Player</th>
            <th>G</th>
            <th>A</th>
            <th>2A</th>
            <th>D!</th>
            <th>Drop</th>
            <th>TA</th>
            <th>Pass</th>
          </tr>
        </thead>
        <tbody>
          {
            statisticsData.map(player =>
              <tr key={player.id}>
                <td>{player.nickname}</td>
                <td>{player.statGoal}</td>
                <td>{player.statAssist}</td>
                <td>{player.stat2Assist}</td>
                <td>{player.statD}</td>
                <td>{player.statDrop}</td>
                <td>{player.statTA}</td>
                <td>{player.statsPass} ({player.statsPassMale}:{player.statsPassFemale})</td>    
              </tr>
            )
          }
        </tbody>
      </Table>
    </Col>
  );
}

function ShowChart(props) {

  const {chartData} = props;
/*
  const data = [
                  {"name": 1, "passes": 6, "result": "Goal", "sequence": "Bill1, Darren, Shar"},
                  {"name": 2, "passes": 4, "result": "Drop", "sequence": "Bill2, Darren, Shar"},
                  {"name": 3, "passes": 7, "result": "TA", "sequence": "Bill3, Darren, Shar"},
                  {"name": 4, "passes": 4, "result": "Goal", "sequence": "Bill4, Darren, Shar"},
                  {"name": 5, "passes": 16, "result": "Goal", "sequence": "Bill5, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar"},
                  {"name": 6, "passes": 5, "result": "Drop", "sequence": "Bill6, Darren, Shar"},
                  {"name": 7, "passes": 2, "result": "TA", "sequence": "Bill7, Darren, Shar"},
                  {"name": 8, "passes": 8, "result": "Drop", "sequence": "Bill8, Darren, Shar"},
                  {"name": 9, "passes": 8, "result": "Goal", "sequence": "Bill9, Darren, Shar"},
                  {"name": 10, "passes": 8, "result": "Goal", "sequence": "Bill10, Darren, Shar"},
                  {"name": 11, "passes": 6, "result": "Goal", "sequence": "Bill11, Darren, Shar"},
                  {"name": 12, "passes": 4, "result": "Drop", "sequence": "Bill12, Darren, Shar"},
                  {"name": 13, "passes": 7, "result": "TA", "sequence": "Bill13, Darren, Shar"},
                  {"name": 14, "passes": 4, "result": "Goal", "sequence": "Bill14, Darren, Shar"},
                  {"name": 15, "passes": 36, "result": "Goal", "sequence": "Bill15, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar, Darren, Shar"},
                  {"name": 16, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 17, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 18, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 19, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 20, "passes": 8, "result": "Goal", "sequence": "Bill20, Darren, Shar"},
                  {"name": 16, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 17, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 18, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 19, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 20, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 21, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 22, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 23, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 24, "passes": 8, "result": "Goal", "sequence": "Bill20, Darren, Shar"},
                  {"name": 25, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 26, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 27, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 28, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 29, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 30, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 31, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 32, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 33, "passes": 8, "result": "Goal", "sequence": "Bill20, Darren, Shar"},
                  {"name": 34, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 35, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 36, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 37, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 38, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 39, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 40, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 41, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"},
                  {"name": 42, "passes": 8, "result": "Goal", "sequence": "Bill20, Darren, Shar"},
                  {"name": 43, "passes": 5, "result": "Drop", "sequence": "Bill16, Darren, Shar"},
                  {"name": 44, "passes": 2, "result": "TA", "sequence": "Bill17, Darren, Shar"},
                  {"name": 45, "passes": 8, "result": "Drop", "sequence": "Bill18, Darren, Shar"},
                  {"name": 46, "passes": 8, "result": "Goal", "sequence": "Bill19, Darren, Shar"}
                ];
*/
  const colorGoal = 'green';
  const colorDrop = 'red';
  const colorTA = 'orange';

  const renderTooltip = (props) => {
    const { payload, label} = props;
    if (payload[0] && payload[0].payload) {
      return (
        <div className="custom-tooltip">
          <p className="label">Possession: {label} - {payload[0].payload.result}</p>
          <p className="desc">{payload[0].payload.sequence}</p>
        </div>
      );
    }
    return (
      <div></div>
    );
  }
  
  const renderLegend = (props) => {
    return (
      <ul className="recharts-default-legend legendList">
        <li className="recharts-legend-item legend-item-0 legendItem">
          <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1">
            <path stroke="none" d="M0,4h32v24h-32z" className="recharts-legend-icon" fill={colorGoal}>
            </path>
          </svg>
          <span className="recharts-legend-item-text">Goal</span>
        </li>
        <li className="recharts-legend-item legend-item-1 legendItem">
          <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1">
            <path stroke="none" d="M0,4h32v24h-32z" className="recharts-legend-icon" fill={colorDrop}>
            </path>
          </svg>
          <span className="recharts-legend-item-text">Drop</span>
        </li>
        <li className="recharts-legend-item legend-item-2 legendItem">
          <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1">
            <path stroke="none" d="M0,4h32v24h-32z" className="recharts-legend-icon" fill={colorTA}>
            </path>
          </svg>
          <span className="recharts-legend-item-text">Throw Away</span>
        </li>

      </ul>
    );
  }

  let chartMargin = { top: 20, right: 0, bottom: 0, left: 0};

  return (
    <Col xs={12} md={6} mdOffset={3} className="gameChart">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={chartMargin} layout="vertical" >
          <XAxis type="number" label="# of Passes" />
          <YAxis type="category" dataKey="name" width={25} axisLine={false}  />
          <Tooltip content={renderTooltip} />
          <Legend verticalAlign="top" content={renderLegend} />
          <Bar dataKey="passes">
            {
              chartData.map((entry, index) => (
                <Cell key={chartData[index].name} fill={chartData[index].result === "Goal" ? colorGoal : chartData[index].result === "Drop" ? colorDrop : colorTA} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Col>
  );
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

export default GameView;

/*
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
          */