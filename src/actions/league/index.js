import sessionStore from '../../stores/sessionStore';
import leagueStore from '../../stores/leagueStore';
import { SERVER_URI } from '../../constants/constants';

export function fetchGames(leagueId) {
    const initUrl = 'games/' + leagueId;
    const url = SERVER_URI + initUrl;
    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            leagueStore.mergeGames(data);
            sessionStore.finishRequest();
        });
}

export function fetchTeams(leagueId) {
    const initUrl = 'teams/' + leagueId;
    const url = SERVER_URI + initUrl;
    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            leagueStore.mergeTeams(data);
            sessionStore.finishRequest();
        });
}

