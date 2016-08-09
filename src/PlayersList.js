import React, { Component } from 'react';

class PlayersList extends Component {
  
  render() {
    const { players } = this.props;
      
      return (
        <ul>
          { players.map(playerValue => 
              <li key={playerValue.id}>
                {`${playerValue.playerName} (${playerValue.gender})`}
              </li> 
          )}
        </ul>
      )
    }
}

PlayersList.propTypes = {
  players: React.PropTypes.array
};

PlayersList.defaultProps = {
  players: []
};

export default PlayersList;
