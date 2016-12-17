import sessionStore from '../../stores/sessionStore';
import leagueStore from '../../stores/leagueStore';
import gameStore from '../../stores/gameStore';
import { fetchGames, fetchTeams } from '../../actions/league';

export function resetSession() {
    sessionStore.reset();
    gameStore.reset();
}

export function setTrackStatsMode(mode) {
    fetchLeague(leagueStore.getLeagueId());
    sessionStore.setTrackStatsMode(mode);
}

export function setViewResultsMode(mode) {
    fetchLeague(leagueStore.getLeagueId());
    sessionStore.setViewResultsMode(mode);
}

export function setMaintainMode(mode) {
    fetchLeague(leagueStore.getLeagueId());
    sessionStore.setMaintainMode(mode);
}

function fetchLeague(leagueId) {
    if (leagueStore.getGamesList().length === 0 || leagueStore.getTeamsList().length === 0) {
        fetchGames(leagueId);
        fetchTeams(leagueId);
    }
}
