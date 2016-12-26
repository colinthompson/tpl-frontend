import sessionStore from '../../stores/sessionStore';
import leagueStore from '../../stores/leagueStore';
import gameStore from '../../stores/gameStore';

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
    // Call API to retrieve game events from server
    fetchGameTeamEvents(gameId, teamId);

    // Reload the player list and sub list from leagueStore
    const trackingPlayers = leagueStore.getPlayersByTeam(teamId);
    const subs = leagueStore.getPlayersNotOnTeam(teamId);

    gameStore.mergeTracking(trackingPlayers);
    gameStore.mergeSubs(subs);
}

export function fetchGameTeamEvents(gameId, teamId) {
    const initUrl = 'gameEvents/' + gameId + '/' + teamId;
    const url = '//tuc-tpl.herokuapp.com/' + initUrl;

    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            gameStore.mergeEvents(data);
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

function saveAllEvents() {
    let eventsListJson = gameStore.getEventsListJson();
    
    const initUrl = 'gameEvents/' + gameStore.getGameId() + '/' + gameStore.getTeamId();
    const url = '//tuc-tpl.herokuapp.com/' + initUrl;
    
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
