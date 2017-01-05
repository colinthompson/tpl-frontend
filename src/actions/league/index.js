import sessionStore from '../../stores/sessionStore';
import leagueStore from '../../stores/leagueStore';

export function fetchGames(leagueId) {
    const initUrl = 'games/' + leagueId;
    const url = '//tuc-tpl.herokuapp.com/' + initUrl;
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
    const url = '//tuc-tpl.herokuapp.com/' + initUrl;
    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            leagueStore.mergeTeams(data);
            sessionStore.finishRequest();
        });
}

