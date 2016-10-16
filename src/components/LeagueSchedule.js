import React, { Component } from 'react';

class LeagueSchedule extends Component {
  
  render() {
    const { teams } = this.props;

    return (
        <div className="ui grid container">
          { teams.map(teamValue =>
              <div key={teamValue.gameId} className="row">
                <div className="six wide column">
                  {teamValue.date}
                </div>
                <div className="five wide column">
                  <button className="ui blue button small playerButton fluid"
                    onTouchTap={this.handleOnTouchTap.bind(this, teamValue.homeTeamId, teamValue.gameId)}>
                    {teamValue.homeTeam}
                  </button>
                </div>
                <div className="five wide column">
                  <button className="ui pink button small playerButton fluid"
                    onTouchTap={this.handleOnTouchTap.bind(this, teamValue.awayTeamId, teamValue.gameId)}>
                    {teamValue.awayTeam}
                  </button>
                </div>
              </div>
          )}
        </div>

    )
  }

  handleOnTouchTap(teamIdValue, gameIdValue, event){  
     this.props.onTeamChange(teamIdValue, gameIdValue);
  }

}

LeagueSchedule.propTypes = {
  teams: React.PropTypes.array
};

LeagueSchedule.defaultProps = {
  teams: []
};

export default LeagueSchedule;

