import { observable, action } from 'mobx';
import { forEach } from 'lodash';

class LeagueStore {

    @observable leagueId;
    @observable gamesList;
    @observable teamsList;
    @observable playersList;
    @observable numberOfPendingRequests;

    constructor() {
        this.leagueId = null;
        this.gamesList = [];
        this.teamsList = [];
        this.playersList = [];
        this.numberOfPendingRequests = 0;
    }

    @action reset = () => {
        this.leqgueId = null;
        this.gameList = [];
        this.teamsList = [];
        this.playersList = [];
        this.numberOfPendingRequests = 0; 
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

    getTeamsList() {
        return this.teamsList;
    }

    getPlayersList() {
        return this.playersList;
    }

    getNumberOfPendingRequests() {
        return this.numberOfPendingRequests;
    }


}

const leagueStore = new LeagueStore();

export default leagueStore;
export { LeagueStore };