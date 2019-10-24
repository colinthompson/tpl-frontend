import React from 'react';
import {observer, inject} from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import * as actions from '../actions/index';
import { Navbar, Nav, NavItem, Button, Grid, Row, Col, Modal } from 'react-bootstrap';
import Loading from 'react-loading';
import LeagueSchedule from './LeagueSchedule';
import GameTeamView from './GameTeamView';
import MaintainLeague from './MaintainLeague';
import StatsView from './StatsView';


@inject('sessionStore', 'gameStore', 'statsStore') @observer
export default class App extends React.Component {

    @observable showSubmittedModal;
    @observable showClearStatModal;
    @observable showMaintainModal;

    constructor(props) {
        super(props);
        // Cannot make constructor an @action, therefore, have to assign observable value in runInAction
        runInAction("set modalVisible", () => {
            this.showSubmittedModal = false;
            this.showClearStatModal = false;
            this.showMaintainModal = false;
        })
        this.handleClear = this.handleClear.bind(this);
        this.clearStats = this.clearStats.bind(this);
        this.handleSubmitStats = this.handleSubmitStats.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleAdmin = this.handleAdmin.bind(this);
        this.maintainMode = this.maintainMode.bind(this);
        
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
        this.showMaintainModal = false;
    }

    handleTrackStats() {
        actions.setTrackStatsMode(true);
    }

    handleViewResults() {
        actions.setViewResultsMode(true);
    }

    @action handleAdmin() {
        this.showMaintainModal = true;
    }

    maintainMode() {
        actions.setMaintainMode(true);
        this.closeModal();
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

    handleExitStatsMode() {
        actions.exitStatsMode();
    }

    @action handleSubmitStats() {
        actions.submitEvents();
        this.showSubmittedModal = true;
    }


    render() {

        const { sessionStore, gameStore, statsStore } = this.props;

        if (sessionStore.getNumberOfPendingRequests() > 0) {
            return (
                <div>
                    <Navbar collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                         { gameStore.isGameSelected() ? gameStore.getTeamName() : "Parity League" }
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
                showMaintainModal={this.showMaintainModal}
                clearStats={this.clearStats}
                closeModal={this.closeModal}
                maintainMode={this.maintainMode}
            />

            <Navbar collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                { gameStore.isGameSelected() ? gameStore.getTeamName() : "Parity League" }
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
                    hasStatsData={statsStore.hasStatsData()}
                    handleExitStatsMode={this.handleExitStatsMode}
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
                hasStatsData={statsStore.hasStatsData()}
                handleTrackStats={this.handleTrackStats} 
                handleViewResults={this.handleViewResults} 
                handleAdmin={this.handleAdmin}
            /> 
        </div>

        );

    }
}

function ShowModal(props) {

    const { showClearStatModal, showSubmittedModal, showMaintainModal, closeModal, clearStats, maintainMode } = props;

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
                    <div className="modal-footer-left">
                        <Button bsStyle="primary" onClick={closeModal}>Cancel</Button>
                    </div>
                    <div className="modal-footer-right">
                        <Button bsStyle="danger" onClick={clearStats}>Clear Stats</Button>
                    </div>
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

    if (showMaintainModal) {
        return (
            <Modal show={true} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Maintain League</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Under Construction --This will be a secured area for the admins to:</h4>
                    <p>Set Player Nicknames</p>
                    <p>Reload Roster / Schedule</p>
                    <p>Retrieve Game Stats </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={closeModal}>Close</Button>
                    <Button bsStyle="primary" onClick={maintainMode}>Enter</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div></div>
    );
}

function MainContent(props) {
    
    const { isTrackStatsMode, isViewResultsMode, isMaintainMode, hasStatsData, handleTrackStats, handleViewResults, handleAdmin } = props;

    const rowMargins = {padding: '5px 5px'};
    
    if (isTrackStatsMode || isViewResultsMode) {

        if (hasStatsData) {
            return (
                <StatsView />
            );
        }

        return (
            <div>
            { props.isGameSelected ? <GameTeamView /> : <LeagueSchedule />}
            </div>
        );
    }

    if (isMaintainMode) {
        return (
            <MaintainLeague />
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

    const { isTrackStatsMode, isViewResultsMode, isMaintainMode, isGameSelected, isScoreboardMode, isEditPlayerMode, hasStatsData, handleExitStatsMode, handleScoreboard, handleEditPlayers, handleSchedule, handleSubmitStats, handleClear, handleReturn  } = props;

    if (isTrackStatsMode) {
        if (isGameSelected) {
            if (isScoreboardMode) {
                return (
                    <Nav pullRight>
                        <NavItem onClick={handleScoreboard}>Return</NavItem>
                    </Nav>
                );
            } else {
                if (isEditPlayerMode) {
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
                            {/* <NavItem onClick={handleClear}>Clear Stats</NavItem> */}
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

    if (isViewResultsMode) {
         if (isGameSelected) {
            return (
                <Nav pullRight>
                    <NavItem onClick={handleScoreboard}>Return</NavItem>
                </Nav>
            );
         } else {
            if (hasStatsData) {
                return (
                    <Nav pullRight>
                        <NavItem onClick={handleExitStatsMode}>Return</NavItem>
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
    }

    if (isMaintainMode) {
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


