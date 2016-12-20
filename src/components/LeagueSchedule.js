import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button } from 'react-bootstrap';
import * as actions from '../actions/index';

@inject('leagueStore') @observer
class LeagueSchedule extends React.Component {

  handleSelectGameTeam(gameId, teamId) {
    actions.setGameTeam(gameId, teamId);
  }

  render() {
    const centerContainer = {maxWidth: 400, margin: '0 2px 2px'};
    
    const { leagueStore } = this.props;
    const groupedSchedule = leagueStore.getGamesListGroupByDate();

    return (
      <div style={centerContainer}>
        {
          <BuildSchedule groupedSchedule={groupedSchedule} handleSelectGameTeam={this.handleSelectGameTeam} />
        }
      </div>
    )
  }
}

function BuildSchedule(props) {
    const groupedSchedule = props.groupedSchedule;
    const dayContainer = {margin: '3px auto'};
    return (
      <div>
      {
        groupedSchedule.map(days =>
          <Grid fluid={true} key={days[0].date} style={dayContainer}>
            <Row style={dayContainer}>
              <Col xs={12} md={12} className="text-center">{days[0].date}</Col>
            </Row>
            {
              days.map(game => 
                <Row key={game.id} style={dayContainer}>
                  <Col xs={6} md={6}>
                    <Button bsStyle="info" bsSize="small" block onClick={() => props.handleSelectGameTeam(game.id, game.homeTeamId)}>{game.homeTeam}</Button>
                  </Col>
                  <Col xs={6} md={6}>
                    <Button bsStyle="info" bsSize="small" block onClick={() => props.handleSelectGameTeam(game.id, game.awayTeamId)}>{game.awayTeam}</Button>
                  </Col>
                </Row>
              )
            }
          </Grid>
        )
      }
      </div>
    )
}

export default LeagueSchedule;
