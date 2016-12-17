import { observable, action } from 'mobx';
import { forEach } from 'lodash';

class GameStore {

    @observable gameId;
    @observable teamId;
    @observable trackingList;
    @observable subList;
    @observable eventsList;

    constructor() {
        this.gameId = null;
        this.teamId = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
    }

    @action reset = () => {
        this.gameId = null;
        this.teamId = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
    }

    @action resetGameStats = () => {
        this.eventsList = [];
    }

    @action mergeTracking = (objs) => {
        forEach(objs, (obj) => this.trackingList.push(obj));
    }

    @action mergeSubs = (objs) => {
        forEach(objs, (obj) => this.subList.push(obj));
    }

    @action mergeEvents = (objs) => {
        forEach(objs, (obj) => this.eventsList.push(obj));
    }

    @action setGameTeam(gameId, teamId) {
        this.gameId = gameId;
        this.teamId = teamId;
    }

    getGameId() {
        return this.gameId;
    }

    getTeamId() {
        return this.teamId;
    }

    getTrackingList() {
        return this.trackingList;
    }

    getSubList() {
        return this.subList;
    }

    getEventsList() {
        return this.eventsList;
    }

    isGameSelected() {
        return !!this.gameId && !!this.teamId;
    }

}

const gameStore = new GameStore();

export default gameStore;
export { GameStore };