import React, { Component } from 'react';

class LeagueSchedule extends Component {
  
  render() {
    const { teams } = this.props;

    return (
      
        <div>
          { teams.map(teamValue => 
              <div 
                key={teamValue.gameId}>
                  {teamValue.date}{teamValue.time}{teamValue.location}
                  <button
                    onTouchTap={this.handleOnTouchTap.bind(this, teamValue.homeTeamId)}>
                    {teamValue.homeTeam}
                  </button>
                  <button
                    onTouchTap={this.handleOnTouchTap.bind(this, teamValue.awayTeamId)}>
                    {teamValue.awayTeam}
                  </button>
              </div>

          )}
        </div>

    )
  }

  handleOnTouchTap(teamIdValue, event){  
     this.props.onTeamChange(teamIdValue);
  }

}



LeagueSchedule.propTypes = {
  teams: React.PropTypes.array
};

LeagueSchedule.defaultProps = {
  teams: []
};

export default LeagueSchedule;

