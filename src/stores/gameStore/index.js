import { observable, action } from 'mobx';
import { forEach } from 'lodash';

class GameStore {

    @observable gameId;
    @observable teamId;
    @observable trackingList;
    @observable subList;
    @observable eventsList;
    @observable isEditPlayerMode;

    constructor() {
        this.gameId = null;
        this.teamId = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
        this.isEditPlayerMode = false;
    }

    @action reset = () => {
        this.gameId = null;
        this.teamId = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
        this.isEditPlayerMode = false;
    }

    @action resetGameStats = () => {
        this.eventsList = [];
    }

    @action mergeTracking = (objs) => {
        forEach(objs, (obj) => this.trackingList.push(obj));
        // Sort by Gender / Nickname
        this.trackingList = this.trackingList.sort(function (a,b){
            if (a.gender < b.gender) { return 1; }
            if (a.gender > b.gender) { return -1; }
            if (a.nickname.trim() < b.nickname.trim()) { return -1; }
            if (a.nickname.trim() > b.nickname.trim()) { return 1; }
            return 0;
        })
    }

    @action mergeSubs = (objs) => {
        forEach(objs, (obj) => this.subList.push(obj));
        // Sort by Gender / Nickname
        this.subList = this.subList.sort(function (a,b){
            if (a.gender < b.gender) { return 1; }
            if (a.gender > b.gender) { return -1; }
            if (a.nickname.trim() < b.nickname.trim()) { return -1; }
            if (a.nickname.trim() > b.nickname.trim()) { return 1; }
            return 0;
        })
    }

    @action mergeEvents = (objs) => {
        forEach(objs, (obj) => this.eventsList.push(obj));
        // Sort the events by sequence number
        this.eventsList = this.eventsList.sort(function (a,b) {
            return (a.sequence - b.sequence);
        })
    }

    @action setGameTeam(gameId, teamId) {
        this.gameId = gameId;
        this.teamId = teamId;
    }

    @action toggleEditPlayerMode() {
        this.isEditPlayerMode = !this.isEditPlayerMode;
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

    isEditPlayerMode() {
        return this.isEditPlayerMode;
    }

}

const gameStore = new GameStore();

export default gameStore;
export { GameStore };