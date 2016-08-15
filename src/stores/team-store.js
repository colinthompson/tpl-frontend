import React from 'react';
import * as superagent from 'superagent';
import { observable, computed, action } from 'mobx';
import { MenuItem } from 'material-ui';

//const STORAGE_PREFIX = 'tuc-tpl.';

class Team {
	@observable teamId;
	@observable teamName;
	

	@observable players = [];

	constructor(store, teamId, teamName) {
		this.teamId = teamId;
		this.teamName = teamName;
	}

	@computed get asJSON() {
		return {
			teamId: this.teamId,
			teamName: this.teamName,
			players: this.players.map(player => player.name)
		}
	}

	@action updateTeamName(teamName) {
		this.teamName = teamName;
	}

	@action addPlayer(player) {
		this.players = this.players.concat(player);
	}

	getPlayers() {
		return this.players.slice();
	}

}

class Player {
	@observable playerId;
	@observable playerName;
	@observable gender;
	@observable nickname;

	constructor(store, playerId, playerName, gender, nickname) {
		this.playerId = playerId;
		this.playerName = playerName;
		this.gender = gender;
		this.nickname = nickname;
	}

}

export class TeamStore {
	@observable teams = [];
	@observable selectedTeam = '';
	@observable pendingRequestCount = 0;
	@observable hasLoadedInitialData = false;
	@observable eventLog = [];

	@computed get isLoading() {
		return this.pendingRequestCount > 0;
	}

	@computed get teamsDropDownArray() {
		const teamsArray = this.getTeams().map(val => {
			return {	value: val.teamId,	label: val.teamName	}
		});
		return teamsArray;
	}

	@computed get teamsMenuItems() {
		const teamsArray = this.getTeams().map(val =>  
			<MenuItem
				value={val.teamId}
				key={`key-${val.teamId}`}
				primaryText={val.teamName} />
		);
		return teamsArray;
	}

	@computed get playersList() {
		if (this.selectedTeam === ''){
			return [];
		} else {
			const mySelectedTeam = this.findTeamById(this.selectedTeam);
			return mySelectedTeam.getPlayers();
		}
	}

	@computed get eventLogList() {
		return this.eventLog.slice(-5);
	}

	@action loadTeams() {
		superagent
			.get('//tuc-tpl.herokuapp.com/teams')
			.set('Accept', 'application/json')
			.end(action("loadTeams-callback", (error, results) => {
				if (error)
					console.error(error);
				else {
					const data = JSON.parse(results.text);
					for (const teamData of data) {
						const team = new Team(this, teamData.id, teamData.teamName);
						for (const playerData of teamData.players) {
							const player = new Player(this, playerData.id, playerData.playerName, playerData.gender, playerData.nickname);
							team.addPlayer(player);
						}
						this.teams = this.teams.concat(team);
					}
				}
				this.hasLoadedInitialData = true;
			}))
	}

	@action addEvent(nextEvent) {
		this.eventLog = this.eventLog.concat(nextEvent);
	}

	getTeams() {
		return this.teams.slice();
	}

	findTeamById(teamId) {
		return this.teams.find(team => team.teamId === teamId);
	}

}