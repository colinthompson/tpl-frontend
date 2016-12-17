import sessionStore from '../../stores/sessionStore';
import gameStore from '../../stores/gameStore';

export function resetGameStats() {
    gameStore.resetGameStats();
    //[ToDo] - do we also delete from server?
}

export function setGameTeam(gameId, teamId) {
    gameStore.setGameTeam(gameId, teamId);
    fetchGameTeamEvents(gameId, teamId);
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

