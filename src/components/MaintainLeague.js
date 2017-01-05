import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import * as actions from '../actions/index';

@inject('gameStore') @observer
class MaintainLeague extends React.Component {

    handleReturn = () => {
        actions.resetSession();
    }

    handleSetNickname = () => {
        console.log("handleSetNickname");
    }

    handleReloadLeague = () => {
        console.log("handleReloadLeague");
    }

    handleGenerateStats = () => {
        console.log("handleGenerateStats");
    }

    render() {

        const rowMargins = {padding: '5px 5px'};

        return (
            <Grid fluid={true} >
                <Row >
                    <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button bsStyle="danger" bsSize="large" block onClick={this.handleReturn}>Return</Button></Col>
                    <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button disabled bsStyle="primary" bsSize="large" block onClick={this.handleSetNickname}>Set Player Nicknames (Coming soon)</Button></Col>
                    <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button disabled bsStyle="primary" bsSize="large" block onClick={this.handleReloadLeague}>Reload Roster / Schedule (Coming soon)</Button></Col>
                    <Col style={rowMargins} xs={12} md={4} mdOffset={4}><Button disabled bsStyle="primary" bsSize="large" block onClick={this.handleGenerateStats}>Generate Stats (Coming soon)</Button></Col>
                </Row>
            </Grid>
            );
        }
}



export default MaintainLeague;
