import { observable, action } from 'mobx';

class SessionStore {

    @observable isTrackStatsMode;
    @observable isViewResultsMode;
    @observable isMaintainMode;
    @observable numberOfPendingRequests;
    @observable providedInstructions;
    
    constructor() {
        this.isTrackStatsMode = false;
        this.isViewResultsMode = false;
        this.isMaintainMode = false;
        this.numberOfPendingRequests = 0;
        this.providedInstructions = false;
    }

    @action reset = () => {
        this.isTrackStatsMode = false;
        this.isViewResultsMode = false;
        this.isMaintainMode = false;
        this.numberOfPendingRequests = 0;
        this.providedInstructions = false;
    }

    @action setTrackStatsMode(mode) {
        this.isTrackStatsMode = mode;
    }

    @action setViewResultsMode(mode) {
        this.isViewResultsMode = mode;
    }

    @action setMaintainMode(mode) {
        this.isMaintainMode = mode;
    }

    @action startRequest = () => {
        this.numberOfPendingRequests++;
    }

    @action finishRequest = () => {
        if (this.numberOfPendingRequests > 0){
            this.numberOfPendingRequests--;
        }
    }
    
    @action setProvidedInstructions(flag) {
        this.providedInstructions = flag;
    }

    getTrackStatsMode() {
        return this.isTrackStatsMode;
    }

    getViewResultsMode() {
        return this.isViewResultsMode;
    }

    getMaintainMode() {
        return this.isMaintainMode;
    }

    getNumberOfPendingRequests() {
        return this.numberOfPendingRequests;
    }

    getProvidedInstructions() {
        return this.providedInstructions;
    }
}

const sessionStore = new SessionStore();

export default sessionStore;
export { SessionStore };
