import Vue from '../../../../node_modules/vue/dist/vue.min';
import Vuex from '../../../../node_modules/vuex/dist/vuex';
import getters from './getters';
import actions from './actions';
import {
    LOAD_GAME_LINES
    , LOADING_GAME
    , LOAD_GAME_TEASER
    , ERROR
    , LOAD_PARLAY_GAME
    , LOAD_LIVE_EVENT_GAME
    , LOAD_SECTION_GAME
    , LOAD_UPCOMING_EVENT } from "./mutation_types";

Vue.use(Vuex);

const state = {
    gameSports: null,
    teaserGame: null,
    parlayGame:null,
    liveEvent:null,
    section:null,
    loading: true,
    error:false,
    upcomingEvent:null,
};

// initialize mutations
const mutations = {
    [LOAD_GAME_LINES](state, lines) {
        state.gameSports = lines
    },

    [LOAD_GAME_TEASER](state, lines) {
        state.teaserGame = lines
    },
    [LOADING_GAME](state, loading) {
        state.loading = loading;
    },

    [LOAD_PARLAY_GAME](state, parlayGame) {
      state.parlayGame = parlayGame
    },
    [LOAD_LIVE_EVENT_GAME](state, liveEvent) {
      state.liveEvent = liveEvent;
    },
    [LOAD_SECTION_GAME](state, section) {
      state.section = section;
    },
    [LOAD_UPCOMING_EVENT](state, upcomingEvent) {
        state.upcomingEvent = upcomingEvent;
    },
    [ERROR](state, error) {
        state.error = error;
    }
};

export default new Vuex.Store({
    debug:true,
    state,
    mutations,
    actions,
    getters
})