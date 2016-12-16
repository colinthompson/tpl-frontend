import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {Chart} from 'react-google-charts';

@observer
class GameChart extends Component {

	render() {

        const { chartData } = this.props;
        const rawData = chartData;

        var summaryData = {
            score: 0,
            throwAway: 0,
            drop: 0
        };

        for (var el of rawData) {
            if (el[2]==="Score!") {
                summaryData.score +=1;
            }
            else {
                if (el[2]==="Throw Away") {
                    summaryData.throwAway += 1;
                }
                else {
                    summaryData.drop += 1;
                }
            }
        };

        function formatTooltip (names,passes) {
            //var htmlStr = "<div class='tooltip'>";
            //htmlStr += "<span class='title'>Possession Time: " + passes + "</span><br />"
            var htmlStr = "";
            for (var el of names) {
                htmlStr += el + ", ";
            };
            return htmlStr.substring(0, htmlStr.length - 2);
        }

        var formattedData = rawData.map (function (el,ind) {
        return (
            el[2]==="Score!"?
            [el[0],el[3].length,formatTooltip(el[3],el[1]),0,formatTooltip(el[3],el[1]),0,formatTooltip(el[3],el[1])]:
                el[2]==="Throw Away"?
                [el[0],0,formatTooltip(el[3],el[1]),el[3].length,formatTooltip(el[3],el[1]),0,formatTooltip(el[3],el[1])]:
                    [el[0],0,formatTooltip(el[3],el[1]),0,formatTooltip(el[3],el[1]),el[3].length,formatTooltip(el[3],el[1])]);
        });

        var myData = [["Possessions","Score",{"role":"tooltip"},"Throw Away",{"role":"tooltip"},"Drop",{"role":"tooltip"}]];
        myData = myData.concat(formattedData);

		return (
			<div className="ui grid container">
                <Chart
                    chartType="BarChart"
                    data={myData}
                    height={"1200px"}
                    width={"100%"}
                    options={{
                        title: 'Team Performance',
                        vAxis: {
                            title: 'Possessions',
                            titleTextStyle: {color: 'red'},
                            textStyle: { fontSize: 8}
                        },
                        hAxis: {
                            title: '# Passes',
                            titleTextStyle: {color: 'red'}
                        },
                        isStacked: true,
                        chartArea: { left: 60, top: 20},
                        tooltip: {isHTML: true}
                    }}
                />
			</div>
		)
	}


}

export default GameChart;
