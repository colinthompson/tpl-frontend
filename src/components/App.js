import React from 'react';
import {observer, inject} from 'mobx-react';
import * as actions from '../actions/index';
import { Navbar, Nav, NavItem, Button, Grid, Row, Col } from 'react-bootstrap';
import Loading from 'react-loading';
import LeagueSchedule from './LeagueSchedule';
import GameTeamView from './GameTeamView';


@inject('sessionStore', 'gameStore') @observer
export default class App extends React.Component {

  render() {

    const { sessionStore, gameStore } = this.props;

    if (sessionStore.getNumberOfPendingRequests() > 0) {
        return (
            <div>
                <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                    Parity League
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                </Navbar>
                <Grid fluid={true}>
                    <Row>
                        <Col xs={5} md={5}></Col>
                        <Col md={2} xs={2}>
                            <Loading type='bubbles' color='#999999' />
                        </Col>
                        <Col xs={5} md={5}></Col>
                    </Row>
                </Grid>
            </div>
        );
    }

    return (

      <div>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              Parity League
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <CustomMenu
                isTrackStatsMode={sessionStore.getTrackStatsMode()}
                isViewResultsMode={sessionStore.getViewResultsMode()}
                isMaintainMode={sessionStore.getMaintainMode()}
                isGameSelected={gameStore.isGameSelected()}
                isScoreboardMode={gameStore.getScoreboardMode()}
                isEditPlayerMode={gameStore.getEditPlayerMode()}
            /> 
          </Navbar.Collapse>
        </Navbar>
        <MainContent
            isTrackStatsMode={sessionStore.getTrackStatsMode()}
            isViewResultsMode={sessionStore.getViewResultsMode()}
            isMaintainMode={sessionStore.getMaintainMode()}
            isGameSelected={gameStore.isGameSelected()}
        /> 
      </div>

    );

  }
}

function MainContent(props) {
    const rowMargins = {padding: '5px 5px'};
    if (props.isTrackStatsMode || props.isViewResultsMode) {
        return (
            <div>
            { props.isGameSelected ? <GameTeamView /> : <LeagueSchedule />}
            </div>
        );
    }

    if (props.isMaintainMode) {
        return (
            <div>Maintain Mode</div>
        );
    }

    return (
        <Grid fluid={true} >
            <Row >
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button bsStyle="primary" bsSize="large" block onClick={handleTrackStats}>Record Stats</Button></Col>
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button disabled bsStyle="primary" bsSize="large" block onClick={handleViewResults}>View Results (coming soon)</Button></Col>
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button disabled bsStyle="info" bsSize="large" block onClick={handleAdmin}>Maintain League (coming soon)</Button></Col>
            </Row>
        </Grid>
    );
}


function CustomMenu(props) {
    if (props.isTrackStatsMode) {
        if (props.isGameSelected) {
            if (props.isScoreboardMode) {
                return (
                    <Nav pullRight>
                        <NavItem onClick={handleScoreboard}>Return</NavItem>
                    </Nav>
                );
            } else {
                if (props.isEditPlayerMode) {
                    return (
                        <Nav pullRight>
                            <NavItem onClick={handleEditPlayers}>Return</NavItem>
                        </Nav>
                    );
                } else {
                    return (
                        <Nav pullRight>
                            <NavItem onClick={handleSchedule}>Schedule</NavItem>
                            <NavItem onClick={handleEditPlayers}>Setup Players / Subs</NavItem>
                            <NavItem onClick={handleScoreboard}>Scoreboard</NavItem>
                            <NavItem onClick={handleSubmitStats}>Submit Stats</NavItem>
                            <NavItem onClick={handleClear}>Clear Stats</NavItem>
                        </Nav>
                    );
                }
            }
        } else {
            return (
                <Nav pullRight>
                    <NavItem onClick={handleReturn}>Home</NavItem>
                </Nav>
            );
        }
    }

    if (props.isViewResultsMode) {
        return (
            <Nav pullRight>
                <NavItem onClick={handleReturn}>Home</NavItem>
            </Nav>
        );
    }

    if (props.isMaintainMode) {
        return (
            <Nav pullRight>
                <NavItem onClick={handleReturn}>Home</NavItem>
            </Nav>
        );
    }

    return (
        <Nav pullRight>
            <NavItem onClick={handleReturn}>Home</NavItem>
        </Nav>
    );
}

function handleReturn() {
    actions.resetSession();
}

function handleClear() {
    if (confirm("This will delete the stats for this game / team on the server.  Are you sure?")) {
        actions.resetGameStats();
    }
}

function handleTrackStats() {
    actions.setTrackStatsMode(true);
}

function handleViewResults() {
    actions.setViewResultsMode(true);
}

function handleAdmin() {
    actions.setMaintainMode(true);
}

function handleEditPlayers() {
    actions.toggleEditPlayerMode();
}

function handleSchedule() {
    actions.resetGameStore();
}

function handleScoreboard() {
    actions.toggleScoreboard();
}

function handleSubmitStats() {
    actions.submitEvents();
    alert("Thank you.  The stats has been submitted.")
}
