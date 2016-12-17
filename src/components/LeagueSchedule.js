import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';

@inject('leagueStore') @observer
class LeagueSchedule extends React.Component {

  handleSelectGameTeam(gameId, teamId) {
    // the action should determine if this is in record stats mode or view results mode
    console.log(gameId);
    console.log(teamId);
  }

  render() {
    const { leagueStore } = this.props;
    const groupedSchedule = leagueStore.getGamesListGroupByDate();
    return (
      <div>
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
          <Grid fluid={true} key={days[0].date} >
            <Row>
              <Col>{days[0].date}</Col>
              <Col></Col>
              <Col></Col>
            </Row>
            {
              days.map(game => 
                <Row key={game.id}>
                  <Col xs={4} md={4}>
                    <Button bsStyle="info" bsSize="small" block onClick={() => props.handleSelectGameTeam(game.id, game.homeTeamId)}>{game.homeTeam}</Button>
                  </Col>
                  <Col xs={4} md={4}>
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
