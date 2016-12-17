import sessionStore from '../../stores/sessionStore';

export function resetSession() {
    sessionStore.reset();
}

export function setTrackStatsMode(mode) {
    sessionStore.setTrackStatsMode(mode);
}

export function setViewResultsMode(mode) {
    sessionStore.setViewResultsMode(mode);
}

export function setMaintainMode(mode) {
    sessionStore.setMaintainMode(mode);
}
