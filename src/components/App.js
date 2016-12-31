import React from 'react';
import {observer, inject} from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import * as actions from '../actions/index';
import { Navbar, Nav, NavItem, Button, Grid, Row, Col, Modal } from 'react-bootstrap';
import Loading from 'react-loading';
import LeagueSchedule from './LeagueSchedule';
import GameTeamView from './GameTeamView';


@inject('sessionStore', 'gameStore') @observer
export default class App extends React.Component {

    @observable showSubmittedModal;
    @observable showClearStatModal;

    constructor(props) {
        super(props);
        // Cannot make constructor an @action, therefore, have to assign observable value in runInAction
        runInAction("set modalVisible", () => {
            this.showSubmittedModal = false;
            this.showClearStatModal = false;
        })
        this.handleClear = this.handleClear.bind(this);
        this.clearStats = this.clearStats.bind(this);
        this.handleSubmitStats = this.handleSubmitStats.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleReturn() {
        actions.resetSession();
    }

    @action handleClear() {
        this.showClearStatModal = true;
    }

    clearStats() {
        actions.resetGameStats();
        this.closeModal();
    }

    @action closeModal() {
        this.showClearStatModal = false;
        this.showSubmittedModal = false;
    }

    handleTrackStats() {
        actions.setTrackStatsMode(true);
    }

    handleViewResults() {
        actions.setViewResultsMode(true);
    }

    handleAdmin() {
        actions.setMaintainMode(true);
    }

    handleEditPlayers() {
        actions.toggleEditPlayerMode();
    }

    handleSchedule() {
        actions.resetGameStore();
    }

    handleScoreboard() {
        actions.toggleScoreboard();
    }

    @action handleSubmitStats() {
        actions.submitEvents();
        this.showSubmittedModal = true;
    }


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
                            <Col md={2} xs={2} mdOffset={5} xsOffset={5}>
                                <Loading type='bubbles' color='#999999' />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }

        return (

        <div>
            <ShowModal 
                showClearStatModal={this.showClearStatModal}
                showSubmittedModal={this.showSubmittedModal}
                clearStats={this.clearStats}
                closeModal={this.closeModal}
            />

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
                    handleScoreboard={this.handleScoreboard}
                    handleEditPlayers={this.handleEditPlayers}
                    handleSchedule={this.handleSchedule}
                    handleSubmitStats={this.handleSubmitStats} 
                    handleClear={this.handleClear} 
                    handleReturn={this.handleReturn}
                /> 
            </Navbar.Collapse>
            </Navbar>
            <MainContent
                isTrackStatsMode={sessionStore.getTrackStatsMode()}
                isViewResultsMode={sessionStore.getViewResultsMode()}
                isMaintainMode={sessionStore.getMaintainMode()}
                isGameSelected={gameStore.isGameSelected()}
                handleTrackStats={this.handleTrackStats} 
                handleViewResults={this.handleViewResults} 
                handleAdmin={this.handleAdmin}
            /> 
        </div>

        );

    }
}

function ShowModal(props) {

    const { showClearStatModal, showSubmittedModal, closeModal, clearStats } = props;

    if (showClearStatModal) {
        return (
            <Modal show={true} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Clear Stats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Clear Team Stats</h4>
                    <p>This will delete the stats for this team on the server.  Are you sure?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={closeModal}>Cancel</Button>
                    <Button bsStyle="danger" onClick={clearStats}>Clear</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    if (showSubmittedModal) {
        return (
            <Modal show={true} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Stats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Thank You</h4>
                    <p>The stats for this game has been submitted.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div></div>
    );
}

function MainContent(props) {
    
    const { handleTrackStats, handleViewResults, handleAdmin } = props;

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
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button bsStyle="primary" bsSize="large" block onClick={handleViewResults}>View Results</Button></Col>
                <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button disabled bsStyle="info" bsSize="large" block onClick={handleAdmin}>Maintain League (coming soon)</Button></Col>
            </Row>
        </Grid>
    );
}


function CustomMenu(props) {

    const { handleScoreboard, handleEditPlayers, handleSchedule, handleSubmitStats, handleClear, handleReturn  } = props;

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
                            <NavItem onClick={handleSchedule}>Return to Schedule</NavItem>
                            <NavItem className="divider-vertical"></NavItem>
                            <NavItem onClick={handleEditPlayers}>Setup Players / Subs</NavItem>
                            <NavItem onClick={handleScoreboard}>Scoreboard</NavItem>
                            <NavItem onClick={handleSubmitStats}>Submit Stats</NavItem>
                            <NavItem className="divider-vertical"></NavItem>
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
         if (props.isGameSelected) {
            return (
                <Nav pullRight>
                    <NavItem onClick={handleScoreboard}>Return</NavItem>
                </Nav>
            );
         } else {
            return (
                <Nav pullRight>
                    <NavItem onClick={handleReturn}>Home</NavItem>
                </Nav>
            );
         }
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


