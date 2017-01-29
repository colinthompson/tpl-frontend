import React from 'react';
import { observer, inject } from 'mobx-react';
import {Table } from 'react-bootstrap';

@inject('statsStore') @observer
class StatsView extends React.Component {

    render() {

        const { statsStore } = this.props;
        const statisticsData = statsStore.getStatistics();

        return (
            <ShowScorebord statisticsData={statisticsData} />
        );
    }
}

function ShowScorebord(props) {
  const {statisticsData} = props;

  return (
    <Table responsive striped condensed className="table-stats">
        <thead>
            <tr>
                <th className="player-name">Player</th>
                <th>G</th>
                <th>A</th>
                <th>2A</th>
                <th>D!</th>
                <th>Drop</th>
                <th>TA</th>
                <th>Pass</th>
                <th>Pass (M)</th>
                <th>Pass (F)</th>
            </tr>
        </thead>
        <tbody>
            {
            statisticsData.map((player, idx) => {
                const rowClass =  player.id === -1 ? "tr-total" : "" ;
                return (
                    <tr key={idx} className={rowClass}>
                        <td className="player-name">{player.isSub ? '(SUB) ' + player.nickname : player.nickname}</td>
                        <td>{player.statGoal}</td>
                        <td>{player.statAssist}</td>
                        <td>{player.stat2Assist}</td>
                        <td>{player.statD}</td>
                        <td>{player.statDrop}</td>
                        <td>{player.statTA}</td>
                        <td>{player.statsPass}</td>    
                        <td>{player.statsPassMale}</td>
                        <td>{player.statsPassFemale}</td>
                    </tr>
                    );
                }
            )
            }
        </tbody>
    </Table>
  );
}


export default StatsView;




