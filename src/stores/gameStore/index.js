import { observable, action } from 'mobx';
import { forEach } from 'lodash';

class GameStore {

    @observable gameId;
    @observable trackingList;
    @observable subList;
    @observable eventsList;

    constructor() {
        this.gameId = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
    }

    @action reset = () => {
        this.gameId = null;
        this.trackingList = [];
        this.subList = [];
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

    getGameId() {
        return this.gameId;
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

}

const gameStore = new GameStore();

export default gameStore;
export { GameStore };