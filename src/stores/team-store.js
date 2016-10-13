import React from 'react';
import * as superagent from 'superagent';
import { observable, computed, action } from 'mobx';
import { MenuItem } from 'material-ui';

//const STORAGE_PREFIX = 'tuc-tpl.';
const HOST_URL = '//tuc-tpl.herokuapp.com/';

class Team {
	@observable teamId;
	@observable teamName;
	@observable leagueId;
	
	@observable players = [];

	constructor(store, teamId, teamName, leagueId) {
		this.teamId = teamId;
		this.teamName = teamName;
		this.leagueId = leagueId
	}

	@computed get asJSON() {
		return {
			id: this.teamId,
			leagueId: this.leagueId,
			teamName: this.teamName,
			players: this.players.map(player => {
				return {
					id: player.playerId,
					playerName: player.playerName,
					nickname: player.nickname,
					gender: player.gender,
					leagueId: player.leagueId
				}
			})
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

class Game {
	@observable gameId;
	@observable leagueId;
	@observable date;
	@observable time;
	@observable location;
	@observable homeTeam;
	@observable homeTeamId;
	@observable awayTeam;
	@observable awayTeamId;
	@observable score;

	constructor(store, gameId, leagueId, date, time, location, homeTeam, homeTeamId, awayTeam, awayTeamId, score) {
		this.gameId = gameId;
		this.leagueId = leagueId;
		this.date = date;
		this.time = time;
		this.location = location;
		this.homeTeam = homeTeam;
		this.homeTeamId = homeTeamId;
		this.awayTeam = awayTeam;
		this.awayTeamId = awayTeamId;
		this.score = score;
	}

}

class Player {
	@observable playerId;
	@observable playerName;
	@observable gender;
	@observable nickname;
	@observable teamId;
	@observable leagueId;

	constructor(store, playerId, playerName, gender, nickname, teamId, leagueId) {
		this.playerId = playerId;
		this.playerName = playerName;
		this.gender = gender;
		this.nickname = nickname;
		this.teamId = teamId;
		this.leagueId = leagueId
	}

	@action setNickname(nickname) {
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
	@observable games = [];
	@observable selectedTeam = '';
	@observable pendingRequestCount = 0;
	@observable hasLoadedInitialData = false;
	@observable hasLoadedInitialGameData = false;
	@observable gameLog = [];
	@observable trackingPlayersList = [];
	@observable subPlayersList = [];
	@observable removeMode = false;

	@observable allPlayersList = [];

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

	@computed get scheduleGamesArray() {
		return this.games.slice();
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

	@action loadTeams(leagueId) {
		superagent
			.get(HOST_URL + 'teams/' + leagueId)
			.set('Accept', 'application/json')
			.end(action("loadTeams-callback", (error, results) => {
				if (error)
					console.error(error);
				else {
					const data = JSON.parse(results.text);
					for (const teamData of data) {
						const team = new Team(this, teamData.id, teamData.teamName, teamData.leagueId);
						for (const playerData of teamData.players) {
							const player = new Player(this, playerData.id, playerData.playerName, playerData.gender, playerData.nickname, teamData.id, teamData.leagueId);
							team.addPlayer(player);
							this.allPlayersList = this.allPlayersList.concat(player);
						}
						this.teams = this.teams.concat(team);
					}
				}
				this.hasLoadedInitialData = true;
			}))
	}

	@action loadGames(leagueId) {
		superagent
			.get(HOST_URL + 'games/' + leagueId)
			.set('Accept', 'application/json')
			.end(action("loadGames-callback", (error, results) => {
				if (error)
					console.error(error);
				else {
					const data = JSON.parse(results.text);
					for (const gameData of data) {
						const game = new Game(this, gameData.id, gameData.leagueId, gameData.date, gameData.time, gameData.location, gameData.homeTeam, gameData.homeTeamId, gameData.awayTeam, gameData.awayTeamId, gameData.score);
						this.games = this.games.concat(game);
					}
				}
				this.hasLoadedInitialGameData = true;
			}))
	}

	@action updateTeams() {

		for (const team of this.teams) {

			superagent
				.put(HOST_URL + 'team/' + team.teamId)
				.set('Accept', 'application/json')
				.send(team.asJSON)
				.end(action("updateTeams-callback", (error, result) => {
					if (error)
						console.error(error);
					else {
					}
				}))
		}
		
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
		this.trackingPlayersList = this.allPlayersList.filter(player => player.teamId === teamId);
		this.subPlayersList = this.allPlayersList.filter(player => player.teamId !== teamId);
		this.selectedTeam = teamId;
	}

	@action moveSubPlayerToTrackPlayer(playerId) {
		const playerIndex = this.subPlayersList.findIndex(player => player.playerId === playerId);
		if (playerIndex === -1) return;
		const movePlayer = this.subPlayersList.splice(playerIndex, 1);
		this.trackingPlayersList = this.trackingPlayersList.concat(movePlayer);
	}

	@action moveTrackPlayerToSubPlayer(playerId) {
		const playerIndex = this.trackingPlayersList.findIndex(player => player.playerId === playerId);
		if (playerIndex === -1) return;
		const movePlayer = this.trackingPlayersList.splice(playerIndex, 1);
		this.subPlayersList = this.subPlayersList.concat(movePlayer);
	}

	@action resetToMain() {
		this.selectedTeam = '';
		this.gameLog = [];
		this.trackingPlayersList = [];
		this.subPlayersList = [];
	}

	@action setRemoveMode(value) {
		this.removeMode = value;
	}

	getTeams() {
		return this.teams.slice();
	}

	findTeamById(teamId) {
		return this.teams.find(team => team.teamId === teamId);
	}

}



 