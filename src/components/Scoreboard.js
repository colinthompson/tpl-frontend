import React, { Component } from 'react';

const style = {
  margin: 5,
  width: '100%',
  'backgroundColor': '#FF9800'
};

class Scoreboard extends Component {
  
  render() {

    const { eventLog } = this.props;

    return (
      <div style={style}>
        {
          eventLog.join(' ')

        }
      </div>
    )
  }
}


export default Scoreboard;
