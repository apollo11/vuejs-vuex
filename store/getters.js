// getter.js
export default {
    getGameSports: state => {
        return state.gameSports;
    },

    getTeaserLines: state => {
        return state.teaserGame;
    },

    getParlayGame: state => {
        return state.parlayGame;
    },

    getLiveEvent: state => {
        return state.liveEvent;
    },

    getSection: state => {
        return state.section;
    },

    getUpcomingEvent: state => {
        return state.upcomingEvent;
    },

    loadGame: state => {
        return state.loading;
    },
    getError: state => {
        return state.error;
    }
}