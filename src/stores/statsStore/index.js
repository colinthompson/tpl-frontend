import { observable, action } from 'mobx';
import { forEach } from 'lodash';

class StatsStore {

    @observable selectedWeek;
    @observable statisticsData;

    constructor() {
        this.selectedWeek = null;
        this.statisticsData = [];
    }

    @action reset = () => {
        this.selectedWeek = null;
        this.statisticsData = [];
        console.log("RESET");
    }

    @action setStatsWeek(week) {
        this.selectedWeek = week;
    }

    @action mergeStatistics = (objs) => {
        forEach(objs, (obj) => this.statisticsData.push(obj));
        this.statisticsData = this.statisticsData.sort(function (a,b) {
            if (a.isSub > b.isSub) { return 1; }
            if (a.isSub < b.isSub) { return -1; }
            if (a.gender > b.gender) { return 1; }
            if (a.gender < b.gender) { return -1; }
            if (a.nickname.trim() < b.nickname.trim()) { return -1; }
            if (a.nickname.trim() > b.nickname.trim()) { return 1; }
            return 0;
        });
    }

    hasStatsData() {
        return this.statisticsData.length > 0;
    }

    getStatistics() {
        return this.statisticsData.slice();
    }

}

const statsStore = new StatsStore();

export default statsStore;
export { StatsStore };
