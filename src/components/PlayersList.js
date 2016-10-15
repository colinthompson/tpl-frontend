import React, { Component } from 'react';

class PlayersList extends Component {
  
  render() {
    const { players, subs, removeMode } = this.props;

    const subsList = subs.map(val =>
      <option value={val.playerId} key={val.playerId}>{val.nickname}</option>
    );

    const malePlayers = players.filter(player => player.gender === 'Male');
    const femalePlayers = players.filter(player => player.gender === 'Female')

    return (
      <div className="ui grid container">
        <div className="four wide column">
          <button className="ui black button mini actionButton" onTouchTap={this.handleGameEventTap.bind(this, "Goal")}>Goal</button>
        </div>
        <div className="four wide column">
          <button className="ui black button mini actionButton" onTouchTap={this.handleGameEventTap.bind(this, "TA")}>TA</button>
        </div>
        <div className="four wide column">
          <button className="ui black button mini actionButton" onTouchTap={this.handleGameEventTap.bind(this, "Drop")}>Drop</button>
        </div>
        <div className="four wide column">
          <button className="ui black button mini actionButton" onTouchTap={this.handleGameEventTap.bind(this, "D")}>D</button>
        </div>

        <div className="twelve wide column">
          <select className="ui fluid dropdown" onChange={this.handleSubListChanged.bind(this)}>
            <option value="">Add Sub</option>
            {subsList}
          </select>
        </div>
        <div className="three wide column">
          <button className="ui brown button mini actionButton" onTouchTap={this.handleGameEventTap.bind(this, "Undo")}>Undo</button>
        </div>

        <div className="six wide column vertical buttons">
          { malePlayers.map(playerValue => 
              <button 
                key={playerValue.playerId} 
                className="ui blue button small playerButton fluid" 
                onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}>
                  {playerValue.nickname}
              </button>

          )}
        </div>
        <div className="six wide column vertical buttons">
          { femalePlayers.map(playerValue => 
              <button 
                key={playerValue.playerId} 
                className="ui pink button small playerButton fluid" 
                onTouchTap={this.handleOnTouchTap.bind(this, playerValue)}>
                  {playerValue.nickname}
              </button>
          )}
        </div>
        <div className="four wide column vertical buttons">
          <button className="ui black button rightButton fluid">Opp +</button>
          <button className="ui black button rightButton fluid">Opp -</button>
          <button className="ui black button rightButton fluid" onTouchTap={this.handleRemoveTap.bind(this)}>
          { removeMode === true ?
            "Return"  :
            "Remove Player"
          } 
          </button>
          <button className="ui red button rightButton fluid" onTouchTap={this.handleGameEventTap.bind(this, "Reset")}>Reset</button>

        </div>

        
      </div>


    )
  }

  handleRemoveTap(event) {
    this.props.teamStore.setRemoveMode(!this.props.teamStore.removeMode);
  }

  handleSubListChanged(event) {
    this.props.teamStore.moveSubPlayerToTrackPlayer(event.target.value);
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
  
  handleOnTouchTap(playerValue, event){    
    if (this.props.teamStore.removeMode) {
      this.props.teamStore.moveTrackPlayerToSubPlayer(playerValue.playerId);
    } else {
      const gameEvent = this.props.teamStore.createNewGameEvent(this.props.teamStore, playerValue, "");
      this.props.teamStore.addGameEvent(gameEvent);
    }
  }

}

PlayersList.propTypes = {
  players: React.PropTypes.array
};

PlayersList.defaultProps = {
  players: []
};

export default PlayersList;

