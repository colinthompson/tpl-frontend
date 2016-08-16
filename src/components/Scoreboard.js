import React, { Component } from 'react';
import { observer } from 'mobx-react';

const style = {
  margin: 5,
  width: '100%',
  'backgroundColor': '#FF9800'
};


@observer
class Scoreboard extends Component {
  
  render() {

    const { gameLog } = this.props;

    const gameEventArray = gameLog.map((val, idx) => 
      <span key={idx}>
        {val.player.nickname}/{val.eventType}
      </span>
    );

    return (
      <div style={style}>
          {gameEventArray}
      </div>
    )
  }
}

export default Scoreboard;
