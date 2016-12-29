import React from 'react';
import { observer, inject } from 'mobx-react';
import {Table } from 'react-bootstrap';

@inject('gameStore') @observer
class GameTeamStats extends React.Component {

  render() {
    
    const { gameStore } = this.props;
    const statisticsData = gameStore.getStatistics();

    return (
        <ShowScorebord statisticsData={statisticsData} />
    );
  }
}


function ShowScorebord(props) {
  const {statisticsData} = props;

  return (
    <Table responsive striped condensed>
        <thead>
            <tr>
            <th>Player</th>
            <th>G</th>
            <th>A</th>
            <th>2A</th>
            <th>D!</th>
            <th>Drop</th>
            <th>TA</th>
            <th>Pass</th>
            </tr>
        </thead>
        <tbody>
            {
            statisticsData.map(player =>
                <tr key={player.id}>
                <td>{player.nickname}</td>
                <td>{player.statGoal}</td>
                <td>{player.statAssist}</td>
                <td>{player.stat2Assist}</td>
                <td>{player.statD}</td>
                <td>{player.statDrop}</td>
                <td>{player.statTA}</td>
                <td>{player.statsPass} ({player.statsPassMale}:{player.statsPassFemale})</td>    
                </tr>
            )
            }
        </tbody>
    </Table>
  );
}

export default GameTeamStats;
