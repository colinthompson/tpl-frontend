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

	@observable statGoal;
	@observable statAssist;
	@observable stat2Assist;
	@observable statD;
	@observable statTA;
	@observable statDrop;
	@observable statPass;
	@observable statPassMale;
	@observable statPassFemale;

	constructor(store, playerId, playerName, gender, nickname, teamId, leagueId) {
		this.playerId = playerId;
		this.playerName = playerName;
		this.gender = gender;
		this.nickname = nickname;
		this.teamId = teamId;
		this.leagueId = leagueId

		this.clearStatistics();
	}

	@action setNickname(nickname) {
		this.nickname = nickname;
	}

	@action clearStatistics() {
		this.statGoal = 0;
		this.statAssist = 0;
		this.stat2Assist = 0;
		this.statD = 0;
		this.statTA = 0;
		this.statDrop = 0;
		this.statPass = 0;
		this.statPassMale = 0;
		this.statPassFemale = 0;
	}

}

class GameEvent {
	@observable gameId;
	@observable teamId;
	@observable sequence;
	@observable player;
	@observable eventType;
	@observable synchronized;

	constructor(store, gameId, teamId, sequence, player, eventType, synchronized) {
		this.gameId = gameId;
		this.teamId = teamId;
		this.sequence = sequence;
		this.player = player;
		this.eventType = eventType;
		this.synchronized = synchronized;
	}

	@computed get asJSON() {
		return {
			gameId: this.gameId,
			teamId: this.teamId,
			sequence: this.sequence,
			player: this.player,
			eventType: this.eventType
		}
	}

}

export class TeamStore {
	@observable teams = [];
	@observable games = [];
	@observable selectedTeam = '';
	@observable selectedGame = '';
	@observable pendingRequestCount = 0;
	@observable hasLoadedInitialData = false;
	@observable hasLoadedInitialGameData = false;
	@observable gameLog = [];
	@observable trackingPlayersList = [];
	@observable subPlayersList = [];
	@observable removeMode = false;
	@observable teamScore = 0;
	@observable opponentScore = 0;
	@observable allPlayersList = [];
	@observable viewStatsMode = false;

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

	@computed get selectedTeamName() {
		if (this.selectedTeam === ''){
			return "";
		} else {
			const mySelectedTeam = this.findTeamById(this.selectedTeam);
			return mySelectedTeam.teamName;
		}
	}

	@computed get scheduleGamesArray() {
		return this.games.reverse().slice();
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

	@computed get currentGameEventSequence() {
		if (this.gameLog.length === 0){
			return 0;
		} else {
			return this.gameLog[this.gameLog.length - 1].sequence;
		}
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

	@action loadGameEvents(gameId, teamId) {
		superagent
			.get(HOST_URL + 'gameEvents/' + gameId + '/' + teamId)
			.set('Accept', 'application/json')
			.end(action("loadGameEvents-callback", (error, results) => {
				if (error)
					console.error(error);
				else {
					const data = JSON.parse(results.text);
					for (const gameEventData of data) {
						const gameEvent = new GameEvent(this, gameEventData.gameId, gameEventData.teamId, gameEventData.sequence, gameEventData.player, gameEventData.eventType, true); 
						this.gameLog = this.gameLog.concat(gameEvent);
						if (gameEventData.eventType === "Goal"){
							this.teamScore++;
						}

						// Find the player (if the player is on the sub list, add player to the trackingplayerlist)
						// update the stat
						let player = this.trackingPlayersArray.find(player => player.playerId === gameEventData.player.playerId);
						if (!player) {
							player = this.subPlayersArray.find(player => player.playerId === gameEventData.player.playerId);
							if (player) {
								this.moveSubPlayerToTrackPlayer(player.playerId);
							}
						} 
					}
					this.recalculatStatistics();
				}
				//this.hasLoadedInitialGameData = true;
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

	@action updateGameEvents() {		
		const unsynchronizedGameEvents = this.gameLog.filter(gameEvent => gameEvent.synchronized === false);
		for (const gameEvent of unsynchronizedGameEvents){
			superagent
				.put(HOST_URL + 'gameEvent/' + gameEvent.gameId + '/' + gameEvent.teamId + '/' + gameEvent.sequence)
				.set('Accept', 'application/json')
				.send(gameEvent.asJSON)
				.end(action("updateGameEvents-callback", (error, result) => {
					if (error)
						console.error(error);
					else {
						gameEvent.synchronized = true;
					}
				}))
		}
	}

	@action deleteGameEvent(gameId, teamId, sequence) {
		superagent
			.del(HOST_URL + 'gameEvent/' + gameId + '/' + teamId + '/' + sequence)
			.set('Accept', 'application/json')
			.end(action("deleteGameEvents-callback", (error, result) => {
				if (error)
					console.error(error);
				else {
					
				}
			}))

	}

	@action addGameEvent(nextEvent) {
		this.gameLog = this.gameLog.concat(nextEvent);
	}

	@action createNewGameEvent(store, player, eventType, synchronized){
		const nextGameSequence = parseInt(this.currentGameEventSequence, 10) + 1;
		return new GameEvent(store, this.selectedGame, this.selectedTeam, nextGameSequence, player, eventType, synchronized);
	}

	@action updateGameEventType(eventType) {
		if (this.gameLog.length > 0){
			const currentGameEvent = this.gameLog[this.gameLog.length - 1];
			
			if (currentGameEvent.eventType === "Goal" && eventType !== "Goal") {
				this.teamScore--;
			}
			if (currentGameEvent.eventType !== "Goal" && eventType === "Goal") {
				this.teamScore++;
			}

			currentGameEvent.eventType = eventType;

			// if the event is a "Goal", then set the assister and 2nd assister
			if (eventType === 'Goal') {
				const goalEvent = this.gameLog[this.gameLog.length - 1];
				if (this.gameLog.length > 1) {
					const previousEvent = this.gameLog[this.gameLog.length - 2];
					if (previousEvent.eventType === '' && previousEvent.player !== goalEvent.player){
						previousEvent.eventType = 'Assist';
						previousEvent.synchronized = false;
						if (this.gameLog.length > 2) {
							const previous2Event = this.gameLog[this.gameLog.length - 3];
							if (previous2Event.eventType === '' && previous2Event.player !== goalEvent.player) {
								previous2Event.eventType = '2nd Assist';
								previous2Event.synchronized = false;
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
						previousGameEvent.synchronized = false;
						if (this.gameLog.length > 2) {
							const previous2GameEvent = this.gameLog[this.gameLog.length - 3];
							if (previous2GameEvent.eventType === '2nd Assist') {
								previous2GameEvent.eventType = '';
								previous2GameEvent.synchronized = false;
							}
						}
					}
				}
			}
			this.updateGameEvents();
		}
	}

	@action undoGameEvent() {
		// if the one that is being popped is a "Goal" event, then check the previous two events.
		// If the previous one is an assist, clear it
		// If the 2nd previous one is a 2nd assist, clear it
		if (this.gameLog.length === 0) return;
		const poppedGameEvent = this.gameLog.pop();
		this.deleteGameEvent(poppedGameEvent.gameId, poppedGameEvent.teamId, poppedGameEvent.sequence);
		if (poppedGameEvent.eventType === 'Goal') {
			if (this.gameLog.length > 0) {
				const previousGameEvent = this.gameLog[this.gameLog.length - 1];
				if (previousGameEvent.eventType === 'Assist') {
					previousGameEvent.eventType = '';
					previousGameEvent.synchronized = false
					this.deleteGameEvent(previousGameEvent.gameId, previousGameEvent.teamId, previousGameEvent.sequence);
					if (this.gameLog.length > 1) {
						const previous2GameEvent = this.gameLog[this.gameLog.length - 2];
						if (previous2GameEvent.eventType === '2nd Assist') {
							previous2GameEvent.eventType = '';
							previous2GameEvent.synchronized = false;
							this.deleteGameEvent(previous2GameEvent.gameId, previous2GameEvent.teamId, previous2GameEvent.sequence);
						}
					}
				}
			}
			this.teamScore--;	
		} 
	}

	@action selectTeam(teamId, gameId) {
		this.trackingPlayersList = this.allPlayersList.filter(player => player.teamId === teamId);
		this.subPlayersList = this.allPlayersList.filter(player => player.teamId !== teamId);
		this.selectedTeam = teamId;
		this.selectedGame = gameId;
		this.removeMode = false;
		this.teamScre = 0;
		this.opponentScore = 0;
		this.gameLog = [];
		if (gameId !== '') {
			this.loadGameEvents(gameId, teamId);
		}
	}

	@action setOpponentScore(mode) {
		if (mode === '+') {
			this.opponentScore++;
		} else {
			this.opponentScore--;
			if (this.opponentScore < 0) this.opponentScore = 0;
		}
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

	@action clearStats() {
		console.log(this.selectedGame, this.selectedTeam);
		this.gameLog = [];
	}

	@action resetToMain() {
		this.selectedTeam = '';
		this.selectedGame = '';
		this.teamScore = 0;
		this.opponentScore = 0;
		this.gameLog = [];
		this.trackingPlayersList = [];
		this.subPlayersList = [];
	}

	@action setRemoveMode(value) {
		this.removeMode = value;
	}

	@action setViewStatsMode(value) {
		this.viewStatsMode = value;
	}

	@action recalculatStatistics() {

		this.gameLog = this.gameLog.sort(function (a, b) {
			return (a.sequence - b.sequence);
		});

		// clear the stats for the tracking players		
		for (const player of this.trackingPlayersArray) {
			player.clearStatistics();
		}

		let previousPassPlayer = null;

		// run through gameLog to calculate stats

		for (const gameEvent of this.gameLog) {
			let player = this.trackingPlayersArray.find(player => player.playerId === gameEvent.player.playerId);
			if (previousPassPlayer !== null) {
				if (player.gender === "Male") {
					previousPassPlayer.statPassMale++;
				} else {
					previousPassPlayer.statPassFemale++;
				}
			}
			
			previousPassPlayer = null;
			switch (gameEvent.eventType) {
				case "":
				case "Pass":
					player.statPass++;
					previousPassPlayer = player;
					break;
				case "Goal":
					player.statGoal++;
					break;
				case "Assist":
					player.statAssist++;
					previousPassPlayer = player;
					break;
				case "2nd Assist":
					player.stat2Assist++;
					previousPassPlayer = player;
					break;
				case "TA":
					player.statTA++;
					break;
				case "Drop":
					player.statDrop++;
					break;
				case "D":
					player.statD++;
					break;
				default:
					break;
			}
		}


	}

	getTeams() {
		return this.teams.slice();
	}

	findTeamById(teamId) {
		return this.teams.find(team => team.teamId === teamId);
	}

}



 