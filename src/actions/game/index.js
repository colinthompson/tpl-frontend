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
    leagueStore.getPlayersByTeam(gameStore.getTeamId());
    leagueStore.getPlayersNotOnTeam(gameStore.getTeamId());

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

