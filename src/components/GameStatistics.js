import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class GameStatistics extends Component {

	render() {

        const { teamStore } = this.props;

        const trackingPlayers = teamStore.trackingPlayersArray;

        const statistics = trackingPlayers.map(val =>
            <div className="row" key={val.playerId}> 
                <div className="two wide column">
                    {val.nickname}
                </div>
                <div className="two wide column">
                    {val.statGoal}
                </div>
                <div className="two wide column">
                    {val.statAssist}
                </div>
                <div className="two wide column">
                    {val.stat2Assist}
                </div>
                <div className="two wide column">
                    {val.statD}
                </div>
                <div className="two wide column">
                    {val.statDrop}
                </div>
                <div className="two wide column">
                    {val.statTA} 
                </div>
                <div className="two wide column">
                    {val.statPassMale} : {val.statPassFemale }
                </div>
            </div>
        );

		return (
			<div className="ui grid container">
                <div className="four wide column">
                    <button className="ui red button" onTouchTap={this.handleReturnTap.bind(this)}>Return</button>
                </div>

                <div className="row"> 
                    <div className="two wide column">
                        Player
                    </div>
                    <div className="two wide column">
                        G
                    </div>
                    <div className="two wide column">
                        A
                    </div>
                    <div className="two wide column">
                        2A
                    </div>
                    <div className="two wide column">
                        D
                    </div>
                    
                    <div className="two wide column">
                        Drop
                    </div>
                    <div className="two wide column">
                        TA 
                    </div>
                    <div className="two wide column">
                        Pass (M : F) 
                    </div>
                </div>

                {statistics}
				
			</div>
		)
	}

    handleReturnTap(event) {
        //this.props.teamStore.setViewStatsMode(false);
        this.props.onReturn();

    }

}

export default GameStatistics;
