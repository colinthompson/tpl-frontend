import { observable, action } from 'mobx';

class SessionStore {

    @observable isTrackStatsMode;
    @observable isViewResultsMode;
    @observable isMaintainMode;
    
    constructor() {
        this.isTrackStatsMode = false;
        this.isViewResultsMode = false;
        this.isMaintainMode = false;
    }

    @action reset = () => {
        this.isTrackStatsMode = false;
        this.isViewResultsMode = false;
        this.isMaintainMode = false;
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

    getTrackStatsMode() {
        return this.isTrackStatsMode;
    }

    getViewResultsMode() {
        return this.isViewResultsMode;
    }

    getMaintainMode() {
        return this.isMaintainMode;
    }
}

const sessionStore = new SessionStore();

export default sessionStore;
export { SessionStore };
