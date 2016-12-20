import React from 'react';
import {observer, inject} from 'mobx-react';
import * as actions from '../actions/index';
import { Navbar, Nav, NavItem, Button, Grid, Row, Col } from 'react-bootstrap';
import Loading from 'react-loading';
import LeagueSchedule from './LeagueSchedule';
import GameView from './GameView';


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
            { props.isGameSelected ? <GameView /> : <LeagueSchedule />}
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
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button bsStyle="primary" bsSize="large" block onClick={handleViewResults}>View Results</Button></Col>
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button bsStyle="info" bsSize="large" block onClick={handleAdmin}>Maintain League</Button></Col>
            </Row>
        </Grid>
    );
}


function CustomMenu(props) {
    if (props.isTrackStatsMode) {
        return (
            <Nav pullRight>
                <NavItem onClick={handleReturn}>Return to Main</NavItem>
                <NavItem onClick={handleClear}>Clear Stats</NavItem>
            </Nav>
        );
    }

    if (props.isViewResultsMode) {
        return (
            <Nav pullRight>
                <NavItem onClick={handleReturn}>Return to Main</NavItem>
            </Nav>
        );
    }

    if (props.isMaintainMode) {
        return (
            <Nav pullRight>
                <NavItem onClick={handleReturn}>Return to Main</NavItem>
            </Nav>
        );
    }

    return (
        <Nav pullRight>

        </Nav>
    );
}

function handleReturn() {
    actions.resetSession();
}

function handleClear() {
    //actions. ...
    console.log("Are you sure you want to clear stats?");
    actions.resetGameStats();
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

