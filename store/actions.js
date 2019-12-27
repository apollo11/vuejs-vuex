import {CHANGE_MSG, INCREMENT_COUNTER, LOAD_GAME_LINES, LOADING} from "./mutation_types";

export default {
    changeMessage({commit}, msg) {
        commit(CHANGE_MSG, msg)
    },
    incrementCounter ({commit}) {
        commit(INCREMENT_COUNTER)
    },

    getGameSportsLine({commit}) {
         axios.get(jsonTest)
             .then(response => {
                 commit(LOAD_GAME_LINES, response.data);
             }).catch(error => {
                 console.log(error);
                 this.error = true
             })
    }

}
