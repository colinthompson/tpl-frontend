import sessionStore from '../../stores/sessionStore';
import leagueStore from '../../stores/leagueStore';
import gameStore from '../../stores/gameStore';
import { SERVER_URI } from '../../constants/constants';

export function resetGameStats() {
    gameStore.resetGameStats();
    saveAllEvents();
}

// This will clear the game store -- taking you back to the schedule mode
export function resetGameStore() {
    gameStore.reset();
}

export function setGameTeam(gameId, teamId) {
    // Reset the game store
    gameStore.reset();
    // Set the gameID and teamID
    gameStore.setGameTeam(gameId, teamId);

    // set the teamName 
    gameStore.setTeamName(leagueStore.getTeamNameByTeamId(teamId));

    // Call API to retrieve game events from server
    fetchGameTeamEvents(gameId, teamId);

    // Call API to retrieve playerGameStats from server if exist (if previously calculated and stored)
    fetchGameTeamPlayerStatistics(gameId, teamId);

    // Reload the player list and sub list from leagueStore
    const trackingPlayers = leagueStore.getPlayersByTeam(teamId);
    const subs = leagueStore.getPlayersNotOnTeam(teamId);

    gameStore.mergeTracking(trackingPlayers);
    gameStore.mergeSubs(subs);
}

export function fetchGameTeamEvents(gameId, teamId) {
    const initUrl = 'gameEvents/' + gameId + '/' + teamId;
    const url = SERVER_URI + initUrl;

    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            gameStore.mergeEvents(data);
            sessionStore.finishRequest();
        });
}

function fetchGameTeamPlayerStatistics(gameId, teamId) {
    const initUrl = 'playerGameStatistics/' + gameId + '/' + teamId;
    const url = SERVER_URI + initUrl;

    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            gameStore.mergePlayerStatistics(data);
            sessionStore.finishRequest();
        });
}


export function toggleEditPlayerMode() {
    gameStore.toggleEditPlayerMode();
}

export function tapPlayerButton(playerId) {
    if (gameStore.isEditPlayerMode) {
        gameStore.moveTrackToSub(playerId);
    } else {
        gameStore.addNewEvent(playerId);
    }
}

export function moveSubToTrack(playerId) {
    gameStore.moveSubToTrack(playerId);
}

export function setEventType(eventType) {
    gameStore.setEventType(eventType)
    saveAllEvents();
}

export function undoEvent() {
    gameStore.undoEvent();
    saveAllEvents();
}

export function toggleScoreboard() {

    gameStore.toggleScoreboard();
    if (sessionStore.getViewResultsMode()) {
        // if is viewing results mode, then reset the game info as well.
        resetGameStore();
    }
}

export function submitEvents() {
    saveAllEvents();
}

function saveAllEvents() {
    let eventsListJson = gameStore.getEventsListJson();
    
    const initUrl = 'gameEvents/' + gameStore.getGameId() + '/' + gameStore.getTeamId();
    const url = SERVER_URI + initUrl;
    
    eventsListJson = JSON.stringify(eventsListJson);

    return fetch(url, {
            method: "POST",
            body: eventsListJson
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
        });

}
