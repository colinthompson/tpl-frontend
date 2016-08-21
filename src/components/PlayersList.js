import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { DropDownMenu, MenuItem } from "material-ui";

class PlayersList extends Component {
  
  render() {
    const { players, subs } = this.props;

    const subsMenuItems = subs.map(val =>  
      <MenuItem
        value={val.playerId}
        key={`key-${val.playerId}`}
        primaryText={val.nickname} />
    );
 
    const malePlayers = players.filter(player => player.gender === 'Male');
    const femalePlayers = players.filter(player => player.gender === 'Female')

    return (
      <div className="ui grid container">

        <div className="row">
          <div className="four wide column">
            <RaisedButton label="Goal" onTouchTap={this.handleGameEventTap.bind(this, "Goal")} />
          </div>
          <div className="four wide column">
            <RaisedButton label="TA" onTouchTap={this.handleGameEventTap.bind(this, "TA")} />
          </div>
          <div className="four wide column">
            <RaisedButton label="Drop" onTouchTap={this.handleGameEventTap.bind(this, "Drop")} />
          </div>
          <div className="four wide column">
            <RaisedButton label="D" onTouchTap={this.handleGameEventTap.bind(this, "D")} />
          </div>
        </div>

        <div className="row">
          <div className="eight wide column">
            <DropDownMenu className="dropdown"
              value=''
              onChange={this.handleSubListChanged.bind(this)}>
                <MenuItem value='' key='key-0' primaryText='Add Sub' />
                {subsMenuItems}
            </DropDownMenu>
          </div>
          <div className="four wide column">
            <RaisedButton label="Undo" onTouchTap={this.handleGameEventTap.bind(this, "Undo")} />
          </div>
          <div className="four wide column">
            <RaisedButton label="Reset" onTouchTap={this.handleGameEventTap.bind(this, "Reset")} />
          </div>
        </div>


        <div className="row">
          <div className="six wide column">
            { malePlayers.map(playerValue => 
                <div key={playerValue.playerId} >
                <RaisedButton 
                  label={playerValue.nickname} 
                  primary={playerValue.gender === 'Male'}
                  secondary={playerValue.gender === 'Female'}
                  className="button"
                  onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}
                  />
                </div>
            )}
          </div>
          <div className="six wide column">
            { femalePlayers.map(playerValue => 
                <div key={playerValue.playerId}>
                <RaisedButton 
                  label={playerValue.nickname} 
                  primary={playerValue.gender === 'Male'}
                  secondary={playerValue.gender === 'Female'}
                  className="button" 
                  onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}
                  />
                </div>
            )}
          </div>
          <div className="four wide column">
            <div>
              <RaisedButton className="button" label="Opp Score +" />  
            </div>
            <div>          
              <RaisedButton className="button" label="Opp Score -" />
            </div>
          </div>

        </div>

        
        
      </div>
    )
  }

  handleSubListChanged(event, index, value) {
    this.props.teamStore.moveSubPlayerToTrackPlayer(value);
  }
  
  handleGameEventTap(eventType){
    if (eventType === "Reset") {
      this.props.teamStore.resetToMain();
    }

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
