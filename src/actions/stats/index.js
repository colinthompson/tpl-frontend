import sessionStore from '../../stores/sessionStore';
import statsStore from '../../stores/statsStore';
import leagueStore from '../../stores/leagueStore';
import { SERVER_URI } from '../../constants/constants';

export function exitStatsMode() {
    statsStore.reset();
}

export function setStatsWeek(week) {
    fetchWeekStatistics(week);
    statsStore.setStatsWeek(week);
}

function fetchWeekStatistics(week) {
    const initUrl = 'dayStatistics/' + leagueStore.getLeagueId() + '/' + week;
    const url = SERVER_URI + initUrl;

    sessionStore.startRequest();
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            statsStore.mergeStatistics(data);
            sessionStore.finishRequest();
        });
}
