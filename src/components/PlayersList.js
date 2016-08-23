import React, { Component } from 'react';

class PlayersList extends Component {
  
  render() {
    const { players, subs } = this.props;

    /*
    const subsList = subs.map(val =>
      {
        const obj = {};
        obj.value = val.playerId;
        obj.label = val.nickname;
        return obj;
      }
    );
    */

    /*
    <MenuItem
        value={val.playerId}
        key={`key-${val.playerId}`}
        primaryText={val.nickname} />
    */

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
          <button className="ui black button rightButton">+</button>
          <button className="ui black button rightButton">-</button>
          <button className="ui red button rightButton" onTouchTap={this.handleGameEventTap.bind(this, "Reset")}>Reset</button>

        </div>

        
      </div>
    )
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
    //event.target.classList.add('primary');
    //event.target.classList.remove('basic');
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


/*

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
*/
