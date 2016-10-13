import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Scoreboard extends Component {
  
  render() {

    const { gameLog } = this.props;

    const gameEventArray = gameLog.map((val, idx) => 
      <div className="floatDiv" key={idx}>
        {val.player.nickname}<br />{val.eventType}
      </div>
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
