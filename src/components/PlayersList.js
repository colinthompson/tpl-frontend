import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 5,
  width: '40%'
};

class PlayersList extends Component {
  
  render() {
    const { players } = this.props;
      
      return (
        <div>
          { players.map(playerValue => 
              <div key={playerValue.playerId}>
              <RaisedButton 
                label={playerValue.nickname} 
                primary={playerValue.gender === 'Male'}
                secondary={playerValue.gender === 'Female'}
                style={style}
                />
              </div>
          )}
        </div>
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
