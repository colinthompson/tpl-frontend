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

    @action moveSubToTrack(playerId) {
        const playerIndex = this.subList.findIndex(player => player.id === playerId);
        if (playerIndex === -1) return;
        const movePlayer = this.subList.splice(playerIndex, 1);
        this.trackingList = this.trackingList.concat(movePlayer);
        this.trackingList = this.trackingList.sort(function (a,b){
            if (a.gender < b.gender) { return 1; }
            if (a.gender > b.gender) { return -1; }
            if (a.nickname.trim() < b.nickname.trim()) { return -1; }
            if (a.nickname.trim() > b.nickname.trim()) { return 1; }
            return 0;
        })
    }

    @action moveTrackToSub(playerId) {
        const playerIndex = this.trackingList.findIndex(player => player.id === playerId);
        if (playerIndex === -1) return;
        const movePlayer = this.trackingList.splice(playerIndex, 1);
        this.subList = this.subList.concat(movePlayer);
        this.subList = this.subList.sort(function (a,b){
            if (a.gender < b.gender) { return 1; }
            if (a.gender > b.gender) { return -1; }
            if (a.nickname.trim() < b.nickname.trim()) { return -1; }
            if (a.nickname.trim() > b.nickname.trim()) { return 1; }
            return 0;
        })
    }

    // Add a new event for playerId
    @action addNewEvent(playerId) {
        const playerIndex = this.trackingList.findIndex(player => player.id === playerId);
        if (playerIndex === -1) return;
        const player = this.trackingList[playerIndex];
        let newEvent = {};
        newEvent.timestamp = new Date();
        newEvent.isUpdated = false;
        newEvent.gameId = this.gameId;
        newEvent.teamId = this.teamId;
        newEvent.sequence = this.eventsList.length === 0 ? 1 : (parseInt(this.eventsList[this.eventsList.length - 1].sequence, 10) + 1)
        newEvent.eventType = "";
        newEvent.player = player;
        this.eventsList.push(newEvent);
    }

    // Set the event type for the latest event
    @action setEventType(eventType) {
        let currentEvent = this.eventsList.length === 0 ? null : this.eventsList[this.eventsList.length -1];
        if (!currentEvent) return;

        // If the current eventType is a Goal and changing it to a non-Goal 
        // then clean up the "Assist" and "2nd Assist" of the previous events
        if (currentEvent.eventType === "Goal" && eventType !== "Goal") {
            let previousEvent = this.eventsList.length > 1 ?
                                    (this.eventsList[this.eventsList.length - 2].eventType === "Assist" ? 
                                        this.eventsList[this.eventsList.length - 2] : 
                                        null) :
                                    null;
            let previous2Event = this.eventsList.length > 2 ?
                                    (this.eventsList[this.eventsList.length - 3].eventType === "2nd Assist" ?
                                        this.eventsList[this.eventsList.length - 3] :
                                        null) :
                                    null;
            if (previousEvent) previousEvent.eventType = "";
            if (previous2Event) previous2Event.eventType = "";
        }

        // If current eventType is a non-Goal and changing/setting it to a Goal
        // then set the "Assist" and "2nd Assist" of the previous events 
        if (currentEvent.eventType !== "Goal" && eventType === "Goal") {
            let previousEvent = this.eventsList.length > 1 ?
                                    (this.eventsList[this.eventsList.length -2].eventType === "" ?
                                        this.eventsList[this.eventsList.length -2] :
                                        null) :
                                    null;
            let previous2Event = this.eventsList.length > 2 ?
                                    ((this.eventsList[this.eventsList.length - 3].eventType === "" && previousEvent) ?
                                        this.eventsList[this.eventsList.length - 3] :
                                        null) :
                                    null;
            if (previousEvent) previousEvent.eventType = "Assist";
            if (previous2Event) previous2Event.eventType = "2nd Assist";
        }

        currentEvent.eventType = eventType;
        // Need to do this to have mobx observe a change in the array
        this.eventsList = this.eventsList.slice();
    }

    @action undoEvent() {
        // Do a dummy set eventType of the current event to blank (this will handle setting the cleaning up of assist and 2nd assists)
        this.setEventType("");
        this.eventsList.pop();
    }

    getGameId() {
        return this.gameId;
    }

    getTeamId() {
        return this.teamId;
    }

    getTrackingList() {
        return this.trackingList.slice();
    }

    getSubList() {
        return this.subList.slice();
    }

    getEventsList() {
        return this.eventsList.slice();
    }

    getEventsListJson() {
        return {
            gameEvents: this.eventsList.map(event => {
                return {
                    gameId: event.gameId,
                    teamId: event.teamId,
                    sequence: event.sequence,
                    timestamp: event.timestamp,
                    eventType: event.eventType,
                    player: {
                        id: event.player.id,
                        nickname: event.player.nickname,
                        playerName: event.player.playerName,
                        gender: event.player.gender
                        }
                }
            })
        };
    }

    isGameSelected() {
        return (!!this.gameId && !!this.teamId);
    }
    
    getEditPlayerMode() {
        return !!this.isEditPlayerMode;
    }

    // This is the playerId button to disable
    // Only for when the last event does not have an eventType yet
    getPlayerIdToDisable() {
        const lastEvent = (this.eventsList.length > 0 ? this.eventsList[this.eventsList.length - 1] : null);
        if (lastEvent) {
            if (lastEvent.eventType === "") {
                return lastEvent.player.id;
            }
        }
        return "";
    }
    

}

const gameStore = new GameStore();

export default gameStore;
export { GameStore };