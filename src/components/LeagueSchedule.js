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
    const { leagueStore } = this.props;
    const groupedSchedule = leagueStore.getGamesListGroupByDate();

    return (
      <div >
        {
          <BuildSchedule groupedSchedule={groupedSchedule} handleSelectGameTeam={this.handleSelectGameTeam} />
        }
      </div>
    )
  }
}

function BuildSchedule(props) {
    const groupedSchedule = props.groupedSchedule;
    return (
      <div>
      {
        groupedSchedule.map(days =>
          <Grid fluid={true} key={days[0].date} className="scheduleTable">
            <Row>
              <Col xs={12} md={6} mdOffset={3} className="text-center">{days[0].date}</Col>
            </Row>
            {
              days.map(game => 
                <Row key={game.id}>
                  <Col xs={6} md={3} mdOffset={3}>
                    <Button bsStyle="info" bsSize="small" block onClick={() => props.handleSelectGameTeam(game.id, game.homeTeamId)}>{game.homeTeam}</Button>
                  </Col>
                  <Col xs={6} md={3}>
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
