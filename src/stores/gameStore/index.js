import { observable, action } from 'mobx';
import { forEach } from 'lodash';

class GameStore {

    @observable gameId;
    @observable teamId;
    @observable teamName;
    @observable trackingList;
    @observable subList;
    @observable eventsList;
    @observable isEditPlayerMode;
    @observable isScoreboardMode;

    constructor() {
        this.gameId = null;
        this.teamId = null;
        this.teamName = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
        this.isEditPlayerMode = false;
        this.isScoreboardMode = false;
    }

    @action reset = () => {
        this.gameId = null;
        this.teamId = null;
        this.teamName = null;
        this.trackingList = [];
        this.subList = [];
        this.eventsList = [];
        this.isEditPlayerMode = false;
        this.isScoreboardMode = false;
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

    @action setTeamName(teamName) {
        this.teamName = teamName;
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
                                    ((this.eventsList[this.eventsList.length - 3].eventType === "" 
                                        && this.eventsList[this.eventsList.length - 3].player.id !== currentEvent.player.id
                                        && previousEvent) ?
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

        // If the event type is set, then the undo will just undo that.
        // If the event type is not set, then undo will undo the play 

        let currentEvent = this.eventsList.length === 0 ? null : this.eventsList[this.eventsList.length -1];
        if (!currentEvent) return;

        if (currentEvent.eventType === "") {
            this.eventsList.pop();
        } else {
            this.setEventType("");
        }

    }

    @action toggleScoreboard() {
        this.isScoreboardMode = !this.isScoreboardMode;
    }

    getGameId() {
        return this.gameId;
    }

    getTeamId() {
        return this.teamId;
    }

    getTeamName() {
        return this.teamName;
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

    getScoreboardMode() {
        return !!this.isScoreboardMode;
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

    getTeamScore() {
        return this.eventsList.filter(event => event.eventType === "Goal").length;
    }

    getStatistics() {
        // Should return an array of:  (PlayerName, G, A, 2A, D!, Drop, TA, Pass (M:F))

        let statisticsData = [];

        let previousPassPlayer = null;

        for (const gameEvent of this.eventsList) {
            
            // Find the player in the statistics data array, if not found, add that player
            let player = statisticsData.find(player => player.id === gameEvent.player.id);
            if (!player) {
                player = gameEvent.player;
                player.statsPass = 0;
                player.statsPassMale = 0;
                player.statsPassFemale = 0;
                player.statGoal = 0;
                player.statAssist = 0;
                player.stat2Assist = 0;
                player.statTA = 0;
                player.statDrop = 0;
                player.statD = 0;
                statisticsData.push(player);
            }
            
            // Add the passing stats
            if (previousPassPlayer !== null) {
                if (player.gender === "Male") {
                    previousPassPlayer.statsPassMale++;
                } else {
                    previousPassPlayer.statsPassFemale++;
                }
            }

            previousPassPlayer = null;
            switch (gameEvent.eventType) {
                case "":
                case "Pass":
                    player.statsPass++;
                    previousPassPlayer = player;
                    break;
                case "Goal":
					player.statGoal++;
					break;
				case "Assist":
                    player.statsPass++;
					player.statAssist++;
					previousPassPlayer = player;
					break;
				case "2nd Assist":
                    player.statsPass++;
					player.stat2Assist++;
					previousPassPlayer = player;
					break;
				case "TA":
					player.statTA++;
					break;
				case "Drop":
					player.statDrop++;
					break;
				case "D":
					player.statD++;
					break;
				default:
					break;
            }

        }

        statisticsData = statisticsData.sort(function (a,b) {
            if (a.nickname.trim() < b.nickname.trim()) { return -1; }
            if (a.nickname.trim() > b.nickname.trim()) { return 1; }
            return 0;
        });

        const initObj = {};
        initObj.nickname = "";
        initObj.statsPass = 0;
        initObj.statsPassMale = 0;
        initObj.statsPassFemale = 0;
        initObj.statGoal = 0;
        initObj.statAssist = 0;
        initObj.stat2Assist = 0;
        initObj.statTA = 0;
        initObj.statDrop = 0;
        initObj.statD = 0;

        const myTotal = statisticsData.reduce(function(a, b) {
            let totalObj = {};
            totalObj.nickname="Total";
            totalObj.statsPass = a.statsPass + b.statsPass;
            totalObj.statsPassMale = a.statsPassMale + b.statsPassMale;
            totalObj.statsPassFemale = a.statsPassFemale + b.statsPassFemale;
            totalObj.statGoal = a.statGoal + b.statGoal;
            totalObj.statAssist = a.statAssist + b.statAssist;
            totalObj.stat2Assist = a.stat2Assist + b.stat2Assist;
            totalObj.statTA = a.statTA + b.statTA;
            totalObj.statDrop = a.statDrop + b.statDrop;
            totalObj.statD = a.statD + b.statD;
            return totalObj;
        }, initObj);

        myTotal.id=-1;

        statisticsData.push(myTotal);

        return statisticsData;
    }

    getChartData() {
        //Should be an array in the following format:
        //{"name": 1, "passes": 6, "result": "Goal", "sequence": "Bill1, Darren, Shar"},

        let chartData = [];
        let possessionNumber = 1;
        let possession = null;

        for (const gameEvent of this.eventsList) {
            if (!possession) {
                possession = {};
                possession.name = possessionNumber;
                possession.passes = 0;
                possession.result = "";
                possession.sequence = "";
                possession.sequencePlayers = [];
                possessionNumber++;
            }
            if (gameEvent.eventType !== "D") {
                possession.sequencePlayers.push(gameEvent.player.nickname);
                if (gameEvent.eventType !== "Drop" && gameEvent.eventType !== "TA") {
                    possession.passes++;
                }
                if (gameEvent.eventType === "Goal" || gameEvent.eventType === "Drop" || gameEvent.eventType === "TA") {
                    possession.result = gameEvent.eventType;
                    possession.sequence = possession.sequencePlayers.join(', ');
                    chartData.push(possession);
                    possession = null;
                }
            }
        }
        return chartData;
    }
    

}

const gameStore = new GameStore();

export default gameStore;
export { GameStore };