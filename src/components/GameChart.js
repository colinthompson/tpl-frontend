import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {Chart} from 'react-google-charts';

@observer
class GameChart extends Component {

	render() {

        //const { chartData } = this.props;
var rawData =[
["1",5.8,"Score!",["Larry","Matt"]],
["2",1,"Throw Away",["Matt"]],
["3",13.1,"Score!",["Jason","Jane","Jason","Desmond"]],
["4",29.1,"Score!",["Bill","Larry","David","Tiff","Jason","David","Larry","Tiff"]],
["5",1,"Throw Away",["Bill"]],
["6",8.9,"Score!",["Matt","Jason","Matt","Jason"]],
["7",19.3,"Throw Away",["Jason","Matt","Jane","Matt"]],
["8",7.1,"Throw Away",["Matt","Jason","David","Matt"]],
["9",17.6,"Throw Away",["Jason","Desmond","Dana","Desmond"]],
["10",3.7,"Throw Away",["Jason","Bill","Desmond"]],
["11",14.1,"Drop",["Jason","Bill"]],
["12",32.3,"Drop",["Darryl","Jason"]],
["13",1,"Throw Away",["Jason"]],
["14",58.4,"Score!",["Jason","Larry","Darryl","Larry","Jason","Larry","Matt","Desmond","Larry","David"]],
["15",1,"Throw Away",["Jason"]],
["16",1,"Drop",["Matt","Jason"]],
["17",1.1,"Score!",["Jason","Bill"]],
["18",28.4,"Score!",["Matt","Jason","Matt","Jason","Matt","Jason","Matt","Larry","Desmond"]],
["19",18.8,"Throw Away",["Larry","Bill"]],
["20",1,"Throw Away",["Matt"]],
["21",19.3,"Throw Away",["Jason","Dana","Desmond","Jane","Desmond"]],
["22",24.9,"Score!",["Jason","Matt","Larry","Matt","Jason"]],
["23",1,"Throw Away",["Larry"]],
["24",6.4,"Throw Away",["Matt","Larry"]],
["25",24.6,"Drop",["Matt","Dana","Matt","Desmond"]],
["26",6.1,"Throw Away",["Jason","Larry","Darryl","Larry"]],
["27",12.6,"Throw Away",["Jason","Matt","Larry"]],
["28",8.5,"Throw Away",["Matt","Darryl","Larry","Matt"]],
["29",30.8,"Throw Away",["Jason","Matt","Jason","Jane","Jason"]],
["30",1,"Throw Away",["Jane"]],
["31",1.7,"Drop",["Bill","Nancy"]],
["32",30.7,"Drop",["Matt","Larry","Matt","David","Matt"]],
["33",16.6,"Drop",["Larry","Dana","Desmond","Jane"]],
["34",28.2,"Throw Away",["Desmond","Larry","Bill","Desmond","Nancy","Bill","Larry","Desmond","Larry"]],
["35",43.3,"Drop",["Jason","Matt","Jason","David","Jason","Darryl","Matt","Jason","David","Jason","Dana"]],
["36",1,"Throw Away",["Jason"]],
["37",12.4,"Drop",["Matt","Jason"]],
["38",1,"Drop",["Tiff"]],
["39",8.8,"Score!",["Darryl","Matt","Jason"]],
["40",55.3,"Score!",["Jason","Matt","Larry","Jane","Darryl","Larry","Darryl"]],
["41",9.8,"Throw Away",["Larry","Tiff"]],
["42",28.3,"Throw Away",["Jason","Matt","Dana","Bill","Matt","Desmond","Tiff"]],
["43",8.9,"Drop",["Larry","Jason"]],
["44",13.3,"Score!",["Jason","Matt","Larry","Matt","Jason"]]
];

var summaryData = {
score: 0,
throwAway: 0,
drop: 0
};

for (var el of rawData)
 {
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
console.log(myData);

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
