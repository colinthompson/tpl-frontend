import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

@observer
class Main extends Component {

	render() {

		return (
			<div>
				<Link to="/trackGame">Track Game</Link><br />
				<Link to="/admin">Admin</Link><br />
				<Link to="/leagueResults">Result</Link>
			</div>
		)
	}

}

export default Main;