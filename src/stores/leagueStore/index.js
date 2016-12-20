import { observable, action } from 'mobx';
import { forEach, groupBy } from 'lodash';

class LeagueStore {

    @observable leagueId;
    @observable gamesList;
    @observable teamsList;
    @observable playersList;

    constructor() {
        this.leagueId = 463;
        this.gamesList = [];
        this.teamsList = [];
        this.playersList = [];
    }

    @action reset = () => {
        this.leqgueId = null;
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
        forEach(groupByDate, (value,key) => {
            groupedList.push(value);
        })
        return groupedList;
    }

    getTeamsList() {
        return this.teamsList;
    }

    getPlayersList() {
        return this.playersList;
    }

    getPlayersByTeam(teamId) {
        const myTeam = this.teamsList.find(team => team.id === teamId);
        forEach(myTeam.players, (player) => console.log(player.nickname));
    }

    getPlayersNotOnTeam(teamId) {
        const otherTeams = this.teamsList.filter(team => team.id !== teamId);
        forEach(otherTeams, (team) => {
            forEach(team.players, (player) => console.log(team.teamName, player.nickname));
        });
    }

}

const leagueStore = new LeagueStore();

export default leagueStore;
export { LeagueStore };