import {
    ERROR
    , LOAD_GAME_LINES
    , LOAD_GAME_TEASER
    , LOAD_LIVE_EVENT_GAME
    , LOAD_PARLAY_GAME
    , LOAD_SECTION_GAME
    , LOADING_GAME
    , LOAD_UPCOMING_EVENT
} from "./component/store/mutation_types";
import Vue from '../../node_modules/vue/dist/vue.min';
import _ from '../../node_modules/lodash';
import {mapGetters} from '../../node_modules/vuex/dist/vuex';
import {mapActions} from '../../node_modules/vuex/dist/vuex';
import {mapState} from '../../node_modules/vuex/dist/vuex';
import store from './component/store/store';
import axios from '../../node_modules/axios/dist/axios.min';
import moment from '../../node_modules/moment/moment';

/**
 * Sports Menu Component
 * Getting the API's from
 */
Vue.filter('moment', function(value) {

    let dateFormat = new Date(value);

    return moment(dateFormat).format('YYYY-MM-DD');
});

// Vue.prototype.moment = moment;

Vue.component('sports-menu', {
    computed: mapGetters({loading: 'loadGame', info: 'getSection', error: 'getError'}),
    data: {
            data: null,
        },
    methods: {
        randomChar: function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },
        getSection: async  function() {
            await axios.get('/../../src/cli/json/Menu.json?'+ this.randomChar(20), { headers:{'Cache-Control' : 'no-cache', 'Content-Type' : 'application/json'}})
                .then(response => {
                    this.$store.commit(LOAD_SECTION_GAME, response.data);
                    this.$store.commit(LOADING_GAME, false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit(ERROR, true);
                })
        },
        sortViaSortId(value) {
            return _.orderBy(value,['sports.sort_id']);
        },
        checkSport(sportname,linkname) {
            if(sportname.toLowerCase() == linkname.toLowerCase())
                return true;
            else
                return false;
        }
        
    },
    beforeMount() {
        this.getSection();
    },
    mounted() {
        setInterval(() => this.getSection(), 60000);
    }

});

/**
 * Live Betting Component
 * Get the API's from live betting
 */
Vue.component('live-betting', {
    computed: mapGetters({loading: 'loadGame', live: 'getLiveEvent', error: 'getError'}),
    data() {
        return {
            data: null,
            show:null,
        }
    },
    methods: {
        randomChar: function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },
        async getLiveBetting() {
            await axios.get('/../../src/cli/json/LiveEvent.json?'+ this.randomChar(20),{ headers:{'Cache-Control' : 'no-cache', 'Content-Type' : 'application/json'}})
                .then(response => {
                    this.$store.commit(LOAD_LIVE_EVENT_GAME, response.data);
                    this.$store.commit(LOADING_GAME, false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit(ERROR, true);
                })
        },
        undefinedValue(value) {
            let handicapType =  typeof value;
            if(handicapType == "undefined") {

                return "none"
            } else {
                return value
            }
        },
        checkLineType(lineNum) {
            let type;
            switch(lineNum) {
                case 8:
                    type = 'MoneyLineBet';
                    break;
                case 9:
                    type = 'PointSpreadBet';
                    break;
                case 2:
                    type = 'EventOverBet';
                    break;
                case 3:
                    type = 'EventUnderBet';
                    break;
                case 4:
                    type = 'MatchHomeBet';
                    break;
                case 5:
                    type = 'MatchAwayBet';
                    break;
                case 6:
                    type = 'MatchTieBet';
                    break;
                case 10:
                    type = 'ContestantOverBet';
                    break;
                case 11:
                    type = 'ContestantUnderBet';
                    break;
                case 19:
                    type = 'MatchupBet';
                    break;

                case 20:
                    type = 'AsianHandicap';
                    break;
                case 14:
                    type = 'PropositionBet';
                    break;
                default:
                    type = null;
            }

            return type;
        },
        parseDataline(linesData, eventValue, lineVal, eventKey) {

            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                pitcherID: _.toString(lineVal.pitcherID),
                pitcherDisplayName: lineVal.pitcherDisplayName,
                enable: _.toString(linesData.isLineActive),
                linedata: {
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: _.toString('none'),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                    pitcherMatchUpOne: eventKey == 0 ? eventValue.event[1].pitcherDisplayName : '',
                    pitcherMatchUpTwo: eventKey == 1 ? eventValue.event[0].pitcherDisplayName : '',

                },
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,

            };

            return JSON.stringify(mapObj);
        },
        matchUp1(linesData, eventValue) {

            let matchUp1Obj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                linedata: {
                    contestant:1,
                    matchupContestant: _.toString(linesData.matchupContestant1),
                    matchupOdds: linesData.matchupOdds1,

                }
            };

            return JSON.stringify(matchUp1Obj);

        },
        matchUp2(linesData, eventValue) {

            let matchUp2Obj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                linedata: {
                    contestant:2,
                    matchupContestant: _.toString(linesData.matchupContestant2),
                    matchupOdds: linesData.matchupOdds2,

                }
            };

            return JSON.stringify(matchUp2Obj);

        },
        matchTieHomeAway(linesData, eventValue, lineVal, soccer = "") {

            let lineType = this.checkLineType(linesData.lineType);
            let matchTieHomeAwayObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: lineType,
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                multisoccer: _.toString(soccer),
                linedata: {
                    contestantDisplayName: lineType == 'MatchTieBet' ? 'Tie' :  _.toString(lineVal.contestantDisplayName),
                    odds: linesData.odds,
                }
            };

            return JSON.stringify(matchTieHomeAwayObj);

        },
        soccerDataline(linesData, eventValue, lineVal, eventKey, soccer = "") {
            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                pitcherID: _.toString(lineVal.pitcherID),
                pitcherDisplayName: lineVal.pitcherDisplayName,
                enable: _.toString(linesData.isLineActive),
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                linedata: {
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                    pitcherMatchUpOne: eventKey == 0 ? eventValue.event[1].pitcherDisplayName : '',
                    pitcherMatchUpTwo: eventKey == 1 ? eventValue.event[0].pitcherDisplayName : '',
                },
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                multisoccer: _.toString(soccer)
            };

            return JSON.stringify(mapObj);
        },
        computeSpreadSplitBall(splitBall, spread) {

            let compute  = (parseFloat(splitBall) + parseFloat(spread)) / 2;

            return compute
        },
        sectionName(key) {
            let output = _.toInteger(key);
            let result;
            switch(output) {
                case 0:
                    result = 'NFL';
                    break;
                case 1:
                    result = 'NCAA';
                    break;
                case 2:
                    result = 'MLB';
                    break;
                case 3:
                    result = 'NBA';
                    break;
                case 4:
                    result = 'NCAA Men\'s';
                    break;
                case 5:
                    result = 'NHL';
                    break;
                case 6:
                    result = 'WNBA';
                    break;
            }

            return result;
        },

        quickBet(linesData) {

            let mapObj = {
                lineID: linesData.lineID,
                lineType: linesData.lineType
            };

            return JSON.stringify(mapObj);
        },
        showHotInfo(rotationNumber,hotinfolink){
            let width = $(document).width();
            if(width >= 1280){
                if(this.show != null){ 
                    if(this.show==rotationNumber){
                        this.show = null;
                    }else{
                        this.show=rotationNumber;
                    }
                } else {
                    this.show=rotationNumber;
                } 
            }else{
                this.show = null;
                window.open(hotinfolink, '_blank');
            }
        },

        checkLiveLineTypeForHeader(value) {
            let lineType;
            if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 8 &&
                !_.isUndefined(value[0].event[0].lines[1].lineType) && value[0].event[0].lines[1].lineType == 9) {

                lineType = 'MoneySpread';

            } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 10 &&
                !_.isUndefined(value[0].event[0].lines[1].lineType) && value[0].event[0].lines[1].lineType == 11) {

                lineType = 'UnderOver';

            } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 19) {

                lineType = 'Matchup';

            } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 9 &&
                !_.isUndefined(value[0].event[0].lines[1].lineType) && value[0].event[0].lines[1].lineType == 2 &&
                !_.isUndefined(value[0].event[0].lines[2].lineType) && value[0].event[0].lines[2].lineType == 3
            ){
                lineType = 'SpreadTotal';

            } else {
                lineType = '';
            }

            return lineType;
        }
        // ,
        // titleLiveSearch(key) {
        //     let result;

        //     if(key.indexOf('(5-Inning)') > -1) {
        //         result = true;
        //     } else {
        //         result = false;
        //     }

        //     return result;
        // }

    },

    beforeMount() {
        // setInterval(() => chalkGamingAlignment(), 300);
        this.getLiveBetting();
    },

    mounted() {
        setInterval(() => this.getLiveBetting(), 6000);
    }

});

/**
 * Component for Parlay Betting
 * API Response fro Parlay
 */
Vue.component('parlay-betting', {
    computed: mapGetters({loading: 'loadGame', parlay: 'getParlayGame', error: 'getError'}),
    data() {
        return {
            data: null
        }
    },
    methods: {
        randomChar: function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },
        async getParlayGameLines() {
            await axios.get('/../../src/cli/json/ParlayChallenge.json?'+ this.randomChar(20), { headers:{'Cache-Control' : 'no-cache', 'Content-Type' : 'application/json'}})
                .then(response => {
                    this.$store.commit(LOAD_PARLAY_GAME, response.data);
                    this.$store.commit(LOADING_GAME, false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit(ERROR, true);
                })

        },
        undefinedValue(value) {
            let handicapType =  typeof value;
            if(handicapType == "undefined") {

                return "none"
            } else {
                return value
            }
        },
        checkLineType(lineNum) {
            let type;
            switch(lineNum) {
                case 8:
                    type = 'MoneyLineBet';
                    break;
                case 9:
                    type = 'PointSpreadBet';
                    break;
                case 2:
                    type = 'EventOverBet';
                    break;
                case 3:
                    type = 'EventUnderBet';
                    break;
                case 10:
                    type = 'ContestantOverBet';
                    break;
                case 11:
                    type = 'ContestantUnderBet';
                    break;
                case 20:
                    type = 'AsianHandicap';
                    break;
                case 14:
                    type = 'PropositionBet';
                    break;
                default:
                    type = null;
            }

            return type;
        },
        parseDataline(linesData, eventValue, lineVal) {

            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                linedata: {
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                }
            };

            return JSON.stringify(mapObj);
        },

        quickBet(linesData) {

            let mapObj = {
                lineID: linesData.lineID,
                lineType: linesData.lineType
            };

            return JSON.stringify(mapObj);
        }
    },
    beforeMount() {
        this.getParlayGameLines();
    },
    mounted() {
        setInterval(() => this.getParlayGameLines(), 3600000);

    }
});

/**
 * Component for Game Line Betting
 * API Response  from Game Lines
 */
Vue.component('game-lines-betting', {

    computed: mapGetters({loading: 'loadGame', gameLines: 'getGameSports', error: 'getError'}),
    data() {
        return {
            data: null,
            show:null,
            rotation:null,
            active:false
        }
    },
    methods: {
        randomChar: function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },
        async getGameLinesSports() {
            await axios.get('/../../src/cli/json/GameLinesEvent.json?'+ this.randomChar(20), { headers:{'Cache-Control' : 'no-cache', 'Content-Type' : 'application/json'}})
                .then(response => {
                    this.$store.commit(LOAD_GAME_LINES, response.data);
                    this.$store.commit(LOADING_GAME, false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit(ERROR, true);
                })
        },
        undefinedValue(value) {
            let handicapType =  typeof value;
            if(handicapType == "undefined") {

                return 'none'
            } else {
                return value
            }
        },
        sortLimit(value, limit, key) {
            let ordering;
            let header = _.toString(key);
            switch(header) {
                case 'NFL':
                case 'NCAA':
                case 'MLB':
                case 'NBA':
                case 'NCAA Men\'s':
                case 'NHL':
                case 'WNBA':
                    ordering =  _.orderBy(_.slice(value, 0, limit), ['eventStartDateTime']);
                    break;
                default:
                    ordering = value;
            }

            return ordering;

        },
        hideShowAll(value) {
            let show;
            _.forEach(value, function(value) {
                if(value.url != null) {
                    show = true;
                } else {
                    show = false;
                }
            });

            return  show;
        },

        viewAllLink(value) {
            _.forEach(value, function(value) {
                console.log(value.url);
               return  window.location.href = value.url;
            });
        },
        checkLineType(lineNum) {
            let type;
            switch(lineNum) {
                case 8:
                    type = 'MoneyLineBet';
                    break;
                case 9:
                    type = 'PointSpreadBet';
                    break;
                case 2:
                    type = 'EventOverBet';
                    break;
                case 3:
                    type = 'EventUnderBet';
                    break;
                case 4:
                    type = 'MatchHomeBet';
                    break;
                case 5:
                    type = 'MatchAwayBet';
                    break;
                case 6:
                    type = 'MatchTieBet';
                    break;
                case 10:
                    type = 'ContestantOverBet';
                    break;
                case 11:
                    type = 'ContestantUnderBet';
                    break;
                case 19:
                    type = 'MatchupBet';
                    break;

                case 20:
                    type = 'AsianHandicap';
                    break;
                case 14:
                    type = 'PropositionBet';
                    break;
                default:
                    type = null;
            }

            return type;
        },
        parseDataline(linesData, eventValue, lineVal, eventKey) {

            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                pitcherID: _.toString(lineVal.pitcherID),
                pitcherDisplayName: lineVal.pitcherDisplayName,
                enable: _.toString(linesData.isLineActive),
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                linedata: {
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                    pitcherMatchUpOne: eventKey == 0 ? eventValue.event[1].pitcherDisplayName : '',
                    pitcherMatchUpTwo: eventKey == 1 ? eventValue.event[0].pitcherDisplayName : '',
                },
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport
            };

            return JSON.stringify(mapObj);
        },
        matchUp1(linesData, eventValue) {

            let matchUp1Obj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                linedata: {
                    contestant:1,
                    matchupContestant: _.toString(linesData.matchupContestant1),
                    matchupOdds: linesData.matchupOdds1,

                }
            };

            return JSON.stringify(matchUp1Obj);


        },
        matchUp2(linesData, eventValue) {

            let matchUp2Obj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                linedata: {
                    contestant:2,
                    matchupContestant: _.toString(linesData.matchupContestant2),
                    matchupOdds: linesData.matchupOdds2,

                }
            };

            return JSON.stringify(matchUp2Obj);

        },
        matchTieHomeAway(linesData, eventValue, lineVal, soccer = "") {

            let lineType = this.checkLineType(linesData.lineType);
            let matchTieHomeAwayObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: lineType,
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                multisoccer:  _.toString(soccer),
                linedata: {
                    contestantDisplayName: lineType == 'MatchTieBet' ? 'Tie' :  _.toString(lineVal.contestantDisplayName),
                    odds: linesData.odds,
                }
            };

            return JSON.stringify(matchTieHomeAwayObj);

        },
        soccerDataline(linesData, eventValue, lineVal, eventKey, soccer = "") {
            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                pitcherID: _.toString(lineVal.pitcherID),
                pitcherDisplayName: lineVal.pitcherDisplayName,
                enable: _.toString(linesData.isLineActive),
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                linedata: {
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                    pitcherMatchUpOne: eventKey == 0 ? eventValue.event[1].pitcherDisplayName : '',
                    pitcherMatchUpTwo: eventKey == 1 ? eventValue.event[0].pitcherDisplayName : '',
                },
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                multisoccer: _.toString(soccer)
            };

            return JSON.stringify(mapObj);
        },
        computeSpreadSplitBall(splitBall, spread) {

            let compute  = (parseFloat(splitBall) + parseFloat(spread)) / 2;

            return compute
        },

        quickBet(linesData) {

            let mapObj = {
                lineID: linesData.lineID,
                lineType: linesData.lineType
            };

            return JSON.stringify(mapObj);
        },
        showHotInfo(rotationNumber,hotinfolink){
            let width = $(document).width();
            if(width >= 1280){
                if(this.show != null){ 
                    if(this.show==rotationNumber){
                        this.show = null;
                    }else{
                        this.show=rotationNumber;
                    }
                } else {
                    this.show=rotationNumber;
                } 
            }else{
                this.show = null;
                window.open(hotinfolink, '_blank');
            }
        },
        sectionName(key) {
            let output = _.toString(key);
            let result;
            switch(output) {
                case 'NFL':
                    result = 'NFL';
                    break;
                case 'NCAA':
                    result = 'NCAA Football';
                    break;
                case 'MLB':
                    result = 'MLB';
                    break;
                case 'NBA':
                    result = 'NBA';
                    break;
                case 'NCAA Men\'s':
                    result = 'NCAA Basketball';
                    break;
                case 'NHL':
                    result = 'NHL';
                    break;
                case 'WNBA':
                    result = 'WNBA';
                    break;
                default:
                    result = output;

            }

            return result;
        },
        checkLineTypeForHeader(value) {
            let lineType;
             if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 8 &&
                !_.isUndefined(value[0].event[0].lines[1].lineType) && value[0].event[0].lines[1].lineType == 9) {

                 lineType = 'MoneySpread';

             } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 10 &&
                 !_.isUndefined(value[0].event[0].lines[1].lineType) && value[0].event[0].lines[1].lineType == 11) {

                 lineType = 'UnderOver';

             } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 19) {

                 lineType = 'Matchup';
             } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 20) {

                 lineType = 'AsiaHandicap';

             } else if(!_.isUndefined(value[0].event[0].lines[0].lineType) && value[0].event[0].lines[0].lineType == 9 &&
                 !_.isUndefined(value[0].event[0].lines[1].lineType) && value[0].event[0].lines[1].lineType == 2 &&
                 !_.isUndefined(value[0].event[0].lines[2].lineType) && value[0].event[0].lines[2].lineType == 3
             ){
                 lineType = 'SpreadTotal';
             } else {
                 lineType = '';
             }

             return lineType;
        },
        titleGameLinesSearch(key) {
            let result;

            if(key.indexOf('(5-Inning)') > -1) {
                result = true;
            } else {
                result = false;
            }

            return result;
        }

    },
    beforeMount() {
        // setInterval(() => chalkGamingAlignment(), 0);
        this.getGameLinesSports();
    },
    mounted() {
        setInterval(() => this.getGameLinesSports(), 10000);

    }
});

/**
 * Component for Teaser Challenge
 * API Response from Teaser Challenge
 */
Vue.component('teaser-challenge', {

    computed: mapGetters({loading: 'loadGame', teaser: 'getTeaserLines', error: 'getError'}),
    data() {
        return {
            data: null,
        }
    },
    methods: {
        randomChar: function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },

        async getTeaserGameLines() {
            await axios.get('/../../src/cli/json/TeaserChallenge.json?'+ this.randomChar(20), { headers:{'Cache-Control' : 'no-cache', 'Content-Type' : 'application/json'}})
                .then(response => {
                    this.$store.commit(LOAD_GAME_TEASER, response.data);
                    this.$store.commit(LOADING_GAME, false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit(ERROR, true);
                })
        },
        undefinedValue(value) {
            var handicapType =  typeof value;
            if(handicapType == "undefined") {

                return "none"
            } else {
                return value
            }
        },
        checkLineType(lineNum) {
            let type;
            switch(lineNum) {
                case 8:
                    type = 'MoneyLineBet';
                    break;
                case 9:
                    type = 'PointSpreadBet';
                    break;
                case 2:
                    type = 'EventOverBet';
                    break;
                case 3:
                    type = 'EventUnderBet';
                    break;
                case 10:
                    type = 'ContestantOverBet';
                    break;
                case 11:
                    type = 'ContestantUnderBet';
                    break;
                case 20:
                    type = 'AsianHandicap';
                    break;
                case 14:
                    type = 'PropositionBet';
                    break;
                default:
                    type = null;
            }

            return type;
        },
        parseDataline(linesData, eventValue, lineVal, value) {

            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                linedata: {
                    display_spread: this.addToTeaserPoints(value.teaserPoint, linesData.pointSpreadValue),
                    display_under: this.addToTeaserPoints(value.teaserPoint, linesData.underLineValue),
                    display_over: this.subtractToTeaserPoints(value.teaserPoint, linesData.overLineValue),
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                }
            };

            return JSON.stringify(mapObj);
        },

        quickBet(linesData) {

            let mapObj = {
                lineID: linesData.lineID,
                lineType: linesData.lineType
            };

            return JSON.stringify(mapObj);
        },

        addToTeaserPoints(points, value) {

            let addPointsValue = parseFloat(value) + parseFloat(points);

            return addPointsValue;
        },

        subtractToTeaserPoints(points, value) {

            let subtractPointsValue = parseFloat(value) - parseFloat(points);

            return subtractPointsValue;
        }

    },
    beforeMount() {
        this.getTeaserGameLines()
    },
    mounted() {
        setInterval(() => this.getTeaserGameLines(), 3600000);
    }
});

/**
 * Components for Upcoming Event
 */
Vue.component('upcoming-event', {

    data() {
        return {
            data: null,
            show:null,
            rotation:null,
            active:false
        }
    },
    computed: mapGetters({loading: 'loadGame', upcomingEvent: 'getUpcomingEvent', error: 'getError'}),

    methods: {
        randomChar: function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },

        async getUpcomingEventLines() {
            await axios.get('/../../src/cli/json/GetUpcomingEvents.json?' + this.randomChar(20), {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.$store.commit(LOAD_UPCOMING_EVENT, response.data);
                    this.$store.commit(LOADING_GAME, false);
                }).catch(error => {
                    console.log(error);
                    this.$store.commit(ERROR, true);
                })
        },

        checkLineType(lineNum) {
            let type;
            switch(lineNum) {
                case 8:
                    type = 'MoneyLineBet';
                    break;
                case 9:
                    type = 'PointSpreadBet';
                    break;
                case 2:
                    type = 'EventOverBet';
                    break;
                case 3:
                    type = 'EventUnderBet';
                    break;
                case 4:
                    type = 'MatchHomeBet';
                    break;
                case 5:
                    type = 'MatchAwayBet';
                    break;
                case 6:
                    type = 'MatchTieBet';
                    break;
                case 10:
                    type = 'ContestantOverBet';
                    break;
                case 11:
                    type = 'ContestantUnderBet';
                    break;
                case 19:
                    type = 'MatchupBet';
                    break;

                case 20:
                    type = 'AsianHandicap';
                    break;
                case 14:
                    type = 'PropositionBet';
                    break;
                default:
                    type = null;
            }

            return type;
        },
        undefinedValue(value) {
            let handicapType =  typeof value;
            if(handicapType == "undefined") {

                return 'none'
            } else {
                return value
            }
        },
        parseDataline(linesData, eventValue, lineVal, eventKey) {
            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                pitcherID: _.toString(lineVal.pitcherID),
                pitcherDisplayName: lineVal.pitcherDisplayName,
                enable: _.toString(linesData.isLineActive),
                linedata: {
                    contestantDisplayName: lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                    pitcherMatchUpOne: eventKey == 0 ? eventValue.event[1].pitcherDisplayName : '',
                    pitcherMatchUpTwo: eventKey == 1 ? eventValue.event[0].pitcherDisplayName : '',
                },
                eventTitle: eventValue.eventTitle,
                sport: 'none'
            };

            return JSON.stringify(mapObj);
        },
        matchUp1(linesData, eventValue) {

            let matchUp1Obj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                linedata: {
                    contestant:1,
                    matchupContestant: _.toString(linesData.matchupContestant1),
                    matchupOdds: linesData.matchupOdds1,

                }
            };

            return JSON.stringify(matchUp1Obj);

        },
        matchUp2(linesData, eventValue) {

            let matchUp2Obj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                linedata: {
                    contestant:2,
                    matchupContestant: _.toString(linesData.matchupContestant2),
                    matchupOdds: linesData.matchupOdds2,

                }
            };

            return JSON.stringify(matchUp2Obj);

        },
        matchTieHomeAway(linesData, eventValue, lineVal, soccer = "") {

            let lineType = this.checkLineType(linesData.lineType);
            let matchTieHomeAwayObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: lineType,
                iscircled: _.toString(linesData.isCircled),
                enable: _.toString(linesData.isLineActive),
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                multisoccer: _.toString(soccer),
                linedata: {
                    contestantDisplayName: lineType == 'MatchTieBet' ? 'Tie' :  _.toString(lineVal.contestantDisplayName),
                    odds: linesData.odds,
                }
            };

            return JSON.stringify(matchTieHomeAwayObj);

        },
        soccerDataline(linesData, eventValue, lineVal, eventKey, soccer = "") {
            let mapObj = {
                extid: linesData.lineID,
                linetypenum: linesData.lineType,
                linetype: this.checkLineType(linesData.lineType),
                iscircled: _.toString(linesData.isCircled),
                pitcherID: _.toString(lineVal.pitcherID),
                pitcherDisplayName: lineVal.pitcherDisplayName,
                enable: _.toString(linesData.isLineActive),
                section:_.toString(eventValue.sectionDisplayName),
                league: _.toString(eventValue.leagueType),
                linedata: {
                    contestantDisplayName:lineVal.contestantDisplayName,
                    propDescription:lineVal.contestantDisplayName,
                    rotationNumber: _.toString(lineVal.rotationNumber),
                    isHomeTeam: _.toString(lineVal.isHomeTeam),
                    splitBallValue: linesData.splitBall,
                    odds: linesData.odds,
                    pointSpreadValue: linesData.pointSpreadValue,
                    handicapPrice: this.undefinedValue(linesData.handicap),
                    overLineValue: _.toString(linesData.overLineValue),
                    underLineValue: _.toString(linesData.underLineValue),
                    pitcherMatchUpOne: eventKey == 0 ? eventValue.event[1].pitcherDisplayName : '',
                    pitcherMatchUpTwo: eventKey == 1 ? eventValue.event[0].pitcherDisplayName : '',
                },
                eventTitle: eventValue.eventTitle,
                sport: eventValue.sport,
                multisoccer: _.toString(soccer)
            };

            return JSON.stringify(mapObj);
        },
        computeSpreadSplitBall(splitBall, spread) {

            let compute  = (parseFloat(splitBall) + parseFloat(spread)) / 2;

            return compute
        },

        checkLineTypeForUpHeader(value) {
            let lineType;
            if(!_.isUndefined(value.event[0].lines[0].lineType) && value.event[0].lines[0].lineType == 8 &&
                !_.isUndefined(value.event[0].lines[1].lineType) && value.event[0].lines[1].lineType == 9) {

                lineType = 'MoneySpread';

            } else if(!_.isUndefined(value.event[0].lines[0].lineType) && value.event[0].lines[0].lineType == 10 &&
                !_.isUndefined(value.event[0].lines[1].lineType) && value.event[0].lines[1].lineType == 11) {

                lineType = 'UnderOver';

            } else if(!_.isUndefined(value.event[0].lines[0].lineType) && value.event[0].lines[0].lineType == 19) {

                lineType = 'Matchup';

            } else if(!_.isUndefined(value.event[0].lines[0].lineType) && value.event[0].lines[0].lineType == 9 &&
                !_.isUndefined(value.event[0].lines[1].lineType) && value.event[0].lines[1].lineType == 2 &&
                !_.isUndefined(value.event[0].lines[2].lineType) && value.event[0].lines[2].lineType == 3
            ){
                lineType = 'SpreadTotal';

            } else {
                lineType = null
            }

            return lineType;
        },
        titleSearch(key) {
            let result;

            if(key.indexOf('(5-Inning)') > -1) {
                result = true;
            } else {
                result = false;
            }

            return result;
        }
    },
    beforeMount() {
        this.getUpcomingEventLines();
    },
    mounted() {
        setInterval(() => this.getUpcomingEventLines(), 3600000);
    }

});


/**
 * Main API
 */
new Vue({
    el: '#top-app',
    store,
});
