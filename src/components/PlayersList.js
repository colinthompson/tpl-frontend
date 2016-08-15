import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 5,
  width: '40%'
};

class PlayersList extends Component {
  
  render() {
    const { players } = this.props;
 
    const malePlayers = players.filter(player => player.gender === 'Male');
    const femalePlayers = players.filter(player => player.gender === 'Female')

    return (
      <div>
        <div>
        { malePlayers.map(playerValue => 
            <div key={playerValue.playerId} >
            <RaisedButton 
              label={playerValue.nickname} 
              primary={playerValue.gender === 'Male'}
              secondary={playerValue.gender === 'Female'}
              style={style}
              onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}
              />
            </div>
        )}
        </div>
        <div>
        { femalePlayers.map(playerValue => 
            <div key={playerValue.playerId}>
            <RaisedButton 
              label={playerValue.nickname} 
              primary={playerValue.gender === 'Male'}
              secondary={playerValue.gender === 'Female'}
              style={style}
              onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}
              />
            </div>
        )}
        </div>
      </div>
    )
  }

  handleOnTouchTap(playerValue){
    this.props.teamStore.addEvent(playerValue.nickname);
  }

}

PlayersList.propTypes = {
  players: React.PropTypes.array
};

PlayersList.defaultProps = {
  players: []
};

export default PlayersList;
