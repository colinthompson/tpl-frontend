import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button } from 'react-bootstrap';
import * as actions from '../actions/index';

@inject('leagueStore', 'sessionStore') @observer
class LeagueSchedule extends React.Component {

  handleSelectGameTeam(gameId, teamId) {
    actions.setGameTeam(gameId, teamId);
  }

  handleSelectStatsWeek(week) {
    actions.setStatsWeek(week);
  }

  render() {
    const { leagueStore, sessionStore } = this.props;
    const groupedSchedule = leagueStore.getGamesListGroupByDate();
    const leagueId = leagueStore.getLeagueId();

    return (
      <div >
        {
          <BuildSchedule
            groupedSchedule={groupedSchedule}
            handleSelectGameTeam={this.handleSelectGameTeam}
            leagueId={leagueId}
            isViewResultsMode={sessionStore.getViewResultsMode()}
            handleSelectStatsWeek={this.handleSelectStatsWeek}
            />
        }
      </div>
    )
  }
}

function DecodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  txt.value = txt.value.replace(/\/$/, "");
  return txt.value;
}

function BuildSchedule(props) {
    const groupedSchedule = props.groupedSchedule;
    const isViewResultsMode = props.isViewResultsMode;
    const leagueId = props.leagueId;
    return (
      <div>
      {
        groupedSchedule.map(days =>
          <Grid fluid={true} key={days[0].date} className="scheduleTable">
            <Row>
              <Col xs={12} md={6} mdOffset={3} className="text-center">

                {isViewResultsMode ?
                   <Button bsStyle="info" bsSize="small" onClick={() => props.handleSelectStatsWeek(days[0].date)}>{days[0].date} Stats</Button> :
                   days[0].date}

              </Col>
            </Row>
            {
              days.map(game => {
                const disabled = (game.id < 34540 && leagueId === 473) ? true : false;
                return (
                  <Row key={game.id}>
                    <Col xs={6} md={3} mdOffset={3}>
                      <Button className="btn-truncate" bsStyle="info" disabled={disabled} bsSize="small" block onClick={() => props.handleSelectGameTeam(game.id, game.homeTeamId)}>{DecodeHtml(game.homeTeam)}</Button>
                    </Col>
                    <Col xs={6} md={3}>
                      <Button className="btn-truncate" bsStyle="info" disabled={disabled} bsSize="small" block onClick={() => props.handleSelectGameTeam(game.id, game.awayTeamId)}>{DecodeHtml(game.awayTeam)}</Button>
                    </Col>
                  </Row>
                );
              }
              )

            }
          </Grid>
        )
      }
      </div>
    )
}

export default LeagueSchedule;
