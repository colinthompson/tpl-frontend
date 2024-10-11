import { observable, action } from 'mobx';
import { forEach, groupBy } from 'lodash';

class LeagueStore {

    @observable leagueId;
    @observable gamesList;
    @observable teamsList;
    @observable playersList;

    constructor() {
        this.leagueId = 806;
        this.gamesList = [];
        this.teamsList = [];
        this.playersList = [];
    }

    @action reset = () => {
        this.leagueId = null;
        this.gameList = [];
        this.teamsList = [];
        this.playersList = [];
    }

    @action mergeGames = (objs) => {
        forEach(objs, (obj) => this.gamesList.push(obj));
    }

    @action mergeTeams = (objs) => {
        forEach(objs, (obj) => this.teamsList.push(obj));
    }

    @action mergePlayers = (objs) => {
        forEach(objs, (obj) => this.playersList.push(obj));
    }

    getLeagueId() {
        return this.leagueId;
    }

    getGamesList() {
        return this.gamesList;
    }

    getGamesListGroupByDate() {
        const groupByDate = groupBy(this.gamesList, 'date');
        const groupedList = [];
        forEach(groupByDate, (value, key) => {
            groupedList.push(value);
        })
        return groupedList.reverse();
    }

    getTeamsList() {
        return this.teamsList.slice();
    }

    getPlayersList() {
        return this.playersList.slice();
    }

    getPlayersByTeam(teamId) {
        const myTeam = this.teamsList.find(team => team.id === teamId);
        return myTeam.players;
    }

    getPlayersNotOnTeam(teamId) {
        const subs = [];
        const otherTeams = this.teamsList.filter(team => team.id !== teamId);
        forEach(otherTeams, (team) => {
            forEach(team.players, (player) => {
                subs.push(player);
            });
        });
        return subs;
    }

    getTeamNameByTeamId(teamId) {
        const myTeam = this.teamsList.find(team => team.id === teamId);
        return myTeam.teamName;
    }

}

const leagueStore = new LeagueStore();

export default leagueStore;
export { LeagueStore };
