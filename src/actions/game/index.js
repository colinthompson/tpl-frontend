import sessionStore from '../../stores/sessionStore';
import leagueStore from '../../stores/leagueStore';
import gameStore from '../../stores/gameStore';

export function resetGameStats() {
    gameStore.resetGameStats();
    //[ToDo] - do we also delete from server?
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
