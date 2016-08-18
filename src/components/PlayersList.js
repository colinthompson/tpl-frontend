import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { DropDownMenu, MenuItem } from "material-ui";

const style = {
  margin: 5,
  width: '40%'
};

class PlayersList extends Component {
  
  render() {
    const { players, subs } = this.props;

console.log("-----" + subs); 
    const subsMenuItems = subs.map(val =>  
      <MenuItem
        value={val.playerId}
        key={`key-${val.playerId}`}
        primaryText={val.nickname} />
    );
 
    const malePlayers = players.filter(player => player.gender === 'Male');
    const femalePlayers = players.filter(player => player.gender === 'Female')

    return (
      <div>
        <div>
          <RaisedButton
            label="Goal"
            onTouchTap={this.handleGameEventTap.bind(this, "Goal")}
            />
          <RaisedButton
            label="TA"
            onTouchTap={this.handleGameEventTap.bind(this, "TA")}
            />
          <RaisedButton
            label="Drop"
            onTouchTap={this.handleGameEventTap.bind(this, "Drop")}
            />
          <RaisedButton
            label="D"
            onTouchTap={this.handleGameEventTap.bind(this, "D")}
            />
          <RaisedButton
            label="Undo"
            onTouchTap={this.handleGameEventTap.bind(this, "Undo")}
            />
          <DropDownMenu
            value=''
            style={{width: "30%"}}
            >
              <MenuItem
                value=''
                key='key-0'
                primaryText='Select Sub' />
              {subsMenuItems}
          </DropDownMenu>
        </div>


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
    )
  }
  
  handleGameEventTap(eventType){
    if (eventType === 'Undo') {
      this.props.teamStore.undoGameEvent();
    } else {
      this.props.teamStore.updateGameEventType(eventType);
    }
  }
  
  handleOnTouchTap(playerValue){
    const gameEvent = this.props.teamStore.createNewGameEvent(this.props.teamStore, playerValue, "");
    this.props.teamStore.addGameEvent(gameEvent);
  }

}

PlayersList.propTypes = {
  players: React.PropTypes.array
};

PlayersList.defaultProps = {
  players: []
};

export default PlayersList;
