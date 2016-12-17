import React from 'react';
import {observer, inject} from 'mobx-react';
import * as actions from '../actions/index';
import { Navbar, Nav, NavItem, Button, Grid, Row, Col } from 'react-bootstrap';
import Loading from 'react-loading';
import LeagueSchedule from './LeagueSchedule';


@inject('sessionStore') @observer
export default class App extends React.Component {

  render() {

    const { sessionStore } = this.props;

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
            /> 
          </Navbar.Collapse>
        </Navbar>
        <MainContent
            isTrackStatsMode={sessionStore.getTrackStatsMode()}
            isViewResultsMode={sessionStore.getViewResultsMode()}
            isMaintainMode={sessionStore.getMaintainMode()}
        /> 
      </div>

    );

  }
}

function MainContent(props) {
    const centerContainer = {maxWidth: 400, margin: '0 auto 10px'};
    if (props.isTrackStatsMode) {
        return (
            <LeagueSchedule />
        );
    }

    if (props.isViewResultsMode) {
        return (
            <LeagueSchedule />
        );
    }

    if (props.isMaintainMode) {
        return (
            <div>Maintain Mode</div>
        );
    }

    return (
        <div style={centerContainer}>
            <Button bsStyle="primary" bsSize="large" block onClick={handleTrackStats}>Record Stats</Button>
            <Button bsStyle="primary" bsSize="large" block onClick={handleViewResults}>View Results</Button>
            <Button bsStyle="info" bsSize="large" block onClick={handleAdmin}>Maintain League</Button>
        </div>
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

