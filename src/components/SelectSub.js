import React from 'react';
import { observer, inject } from 'mobx-react';
//import {Grid, Row, Col, Button } from 'react-bootstrap';
//import * as actions from '../actions/index';
import Select from 'react-select';

@inject('gameStore') @observer
class SelectSub extends React.Component {


  handleChange (value) {
    console.log(value);
  }

  render() {

    const { gameStore } = this.props;

    const options = gameStore.getSubList().map(player => {
        return {
            value: player.id,
            label: player.playerName + ' - ' + player.nickname + ' - ' + player.id,
            gender: player.gender
        }
    });

    return (
      <div>
        <Select
            placeholder="Search for sub name (or nickname)"
            options={options}
            onChange={this.handleChange}
        />
      </div>
    )
  }
}


export default SelectSub;
