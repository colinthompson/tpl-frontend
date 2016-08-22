import React, { Component } from 'react';
import { observer } from 'mobx-react';

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
      <div className="sixteen wide column scoreboardDiv">
        { gameEventArray.length === 0 ?
          "Ready..."  :
          gameEventArray
        }
      </div>
    )
  }
}

export default Scoreboard;
