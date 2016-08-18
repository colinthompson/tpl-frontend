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

class GameEvent {
	@observable player;
	@observable eventType;

	constructor(store, player, eventType) {
		this.player = player;
		this.eventType = eventType;
	}

}

export class TeamStore {
	@observable teams = [];
	@observable selectedTeam = '';
	@observable pendingRequestCount = 0;
	@observable hasLoadedInitialData = false;
	@observable gameLog = [];
	@observable trackingPlayersList = [];
	@observable subPlayersList = [];

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

	@computed get gameLogList() {
		return this.gameLog.slice(-5);
	}

	@computed get trackingPlayersArray() {
		return this.trackingPlayersList.slice();
	}

	@computed get subPlayersArray() {
		return this.subPlayersList.slice();
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

	@action addGameEvent(nextEvent) {
		this.gameLog = this.gameLog.concat(nextEvent);
	}

	@action createNewGameEvent(store, player, eventType){
		return new GameEvent(store, player, eventType);
	}

	@action updateGameEventType(eventType) {
		if (this.gameLog.length > 0){
			this.gameLog[this.gameLog.length - 1].eventType = eventType;

			// if the event is a "Goal", then set the assister and 2nd assister
			if (eventType === 'Goal') {
				const goalEvent = this.gameLog[this.gameLog.length - 1];
				if (this.gameLog.length > 1) {
					const previousEvent = this.gameLog[this.gameLog.length - 2];
					if (previousEvent.eventType === '' && previousEvent.player !== goalEvent.player){
						previousEvent.eventType = 'Assist';
						if (this.gameLog.length > 2) {
							const previous2Event = this.gameLog[this.gameLog.length - 3];
							if (previous2Event.eventType === '' && previous2Event.player !== goalEvent.player) {
								previous2Event.eventType = '2nd Assist';
							}
						}
					}
				}
			} else {
				// recorded a non goal.  So if previous are assist and 2nd assists, wipe them out
				if (this.gameLog.length > 1) {
					const previousGameEvent = this.gameLog[this.gameLog.length - 2];
					if (previousGameEvent.eventType === 'Assist') {
						previousGameEvent.eventType = '';
						if (this.gameLog.length > 2) {
							const previous2GameEvent = this.gameLog[this.gameLog.length - 3];
							if (previous2GameEvent.eventType === '2nd Assist') {
								previous2GameEvent.eventType = '';
							}
						}
					}
				}
			}
		}
	}

	@action undoGameEvent() {
		// if the one that is being popped is a "Goal" event, then check the previous two events.
		// If the previous one is an assist, clear it
		// If the 2nd previous one is a 2nd assist, clear it
		if (this.gameLog.length === 0) return;
		const poppedGameEvent = this.gameLog.pop();
		if (poppedGameEvent.eventType === 'Goal') {
			if (this.gameLog.length > 0) {
				const previousGameEvent = this.gameLog[this.gameLog.length - 1];
				if (previousGameEvent.eventType === 'Assist') {
					previousGameEvent.eventType = '';
					if (this.gameLog.length > 1) {
						const previous2GameEvent = this.gameLog[this.gameLog.length - 2];
						if (previous2GameEvent.eventType === '2nd Assist') {
							previous2GameEvent.eventType = '';
						}
					}
				}
			}	
		} 
	}

	@action selectTeam(teamId) {
		this.subPlayersList = this.findTeamById(teamId).getPlayers().slice();
		this.trackingPlayersList = this.findTeamById(teamId).getPlayers().slice();
		this.selectedTeam = teamId;
	}

	@action resetToMain() {
		this.selectedTeam = '';
		this.gameLog = [];
		this.trackingPlayersList = [];
		this.subPlayersList = [];
	}

	getTeams() {
		return this.teams.slice();
	}

	findTeamById(teamId) {
		return this.teams.find(team => team.teamId === teamId);
	}

}



 