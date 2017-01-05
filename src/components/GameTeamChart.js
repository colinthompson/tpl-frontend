import React from 'react';
import { observer, inject } from 'mobx-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';

@inject('gameStore') @observer
class GameTeamChart extends React.Component {

  render() {
    
    const { gameStore } = this.props;
    const chartData = gameStore.getChartData();

    return (
        <ShowChart chartData={chartData} />
    );

  }
}

function ShowChart(props) {

  const {chartData} = props;

  const colorGoal = 'green';
  const colorDrop = 'red';
  const colorTA = 'orange';

  const renderTooltip = (props) => {
    const { payload, label} = props;
    if (payload[0] && payload[0].payload) {
      return (
        <div className="custom-tooltip">
          <p className="label">Possession: {label} - {payload[0].payload.result}</p>
          <p className="desc">{payload[0].payload.sequence}</p>
        </div>
      );
    }
    return (
      <div></div>
    );
  }
  
  const renderLegend = (props) => {
    return (
      <ul className="recharts-default-legend legendList">
        <li className="recharts-legend-item legend-item-0 legendItem">
          <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1">
            <path stroke="none" d="M0,4h32v24h-32z" className="recharts-legend-icon" fill={colorGoal}>
            </path>
          </svg>
          <span className="recharts-legend-item-text">Goal</span>
        </li>
        <li className="recharts-legend-item legend-item-1 legendItem">
          <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1">
            <path stroke="none" d="M0,4h32v24h-32z" className="recharts-legend-icon" fill={colorDrop}>
            </path>
          </svg>
          <span className="recharts-legend-item-text">Drop</span>
        </li>
        <li className="recharts-legend-item legend-item-2 legendItem">
          <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1">
            <path stroke="none" d="M0,4h32v24h-32z" className="recharts-legend-icon" fill={colorTA}>
            </path>
          </svg>
          <span className="recharts-legend-item-text">Throw Away</span>
        </li>

      </ul>
    );
  }

  let chartMargin = { top: 20, right: 0, bottom: 0, left: 0};

  return (
    
    <ResponsiveContainer>
    <BarChart data={chartData} margin={chartMargin} layout="vertical" >
        <XAxis type="number" label="# of Passes" />
        <YAxis type="category" dataKey="name" width={25} axisLine={false}  />
        <Tooltip content={renderTooltip} />
        <Legend verticalAlign="top" content={renderLegend} />
        <Bar dataKey="passes">
        {
            chartData.map((entry, index) => (
            <Cell key={chartData[index].name} fill={chartData[index].result === "Goal" ? colorGoal : chartData[index].result === "Drop" ? colorDrop : colorTA} />
            ))
        }
        </Bar>
    </BarChart>
    </ResponsiveContainer>
    
  );
}



export default GameTeamChart;
