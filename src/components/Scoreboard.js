import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Scoreboard extends Component {
  
  render() {

    const { gameLog, teamName, teamScore, opponentScore } = this.props;


    const gameEventArray = gameLog.map((val, idx) => 
      <div className="floatDiv" key={idx}>
        {val.player.nickname}<br />{val.eventType}{val.sequence}
      </div>
    );

    return (
      <div className="row">
        <div className="sixteen wide column scoreboardDiv">
          { gameEventArray.length === 0 ?
            "Ready..."  :
            gameEventArray
          }
        </div>
        <div className="eight wide column">
          {teamName}: {teamScore}
        </div>
        <div className="eight wide column">
          Opponent: {opponentScore}
        </div>
      </div>
    )
  }
}

export default Scoreboard;
