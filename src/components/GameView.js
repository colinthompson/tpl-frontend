import React from 'react';
import { observer, inject } from 'mobx-react';
import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';
import SelectSub from './SelectSub';


@inject('gameStore') @observer
class GameView extends React.Component {

  render() {
    
    const { gameStore } = this.props;
    
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} md={6} mdOffset={3} className="text-center">
            <SelectSub />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6} mdOffset={3}>
            <div  className="masonry">
              {
                gameStore.getTrackingList().map(player =>
                  <div key={player.id} className="item">
                    <Button bsStyle="info" bsSize="small" block onClick={(val) => console.log(val)}>{player.nickname} - {player.gender}</Button>
                  </div>
                )
              }
            </div>
          </Col>
        </Row>
        

        
        <h1>SUBS FOR TEAM</h1>
        {
          gameStore.getSubList().map(player =>
            <div key={player.id}>
              {player.nickname} - {player.gender}
            </div>
          )
        }

        <h1>EVENTS</h1>
        {
          gameStore.getEventsList().map(event =>
            <div key={event.sequence}>
                {event.sequence} - {event.player.nickname} - {event.eventType}
            </div>
          )
        }
      </Grid>
    )
  }
}

export default GameView;
