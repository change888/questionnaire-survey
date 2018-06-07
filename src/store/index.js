import Vue from 'vue'
import Vuex from 'vuex'
//import baseWebSocket from './baseWebSocket.js'

Vue.use(Vuex)

let state = {
  xhrArr: [],
  menuList: [],
  currentMenuList: [],
  currentMenuItem: null
};

let getters = {
  xhrArr: (state) => {
    return state.xhrArr || [];
  }
};

let actions = {
    //异常、错误处理
    errorHandler({commit, dispatch, getters, state}, e){

    },

    //noSession跳转页面
    jumpLoginPage({commit, dispatch, getters, state}){
      location.herf = localStorage.getItem('loginPageUrl') || '/';
    },

    //删除所有
    clearAll({commit, dispatch}, isForce){
      // dispatch('clearPushMessageAll', isForce); //消息推送
    },
    
    //请空缓存ajax数组对象
    clearXhrArr({ commit, getters }){
      var xhrArr = getters.xhrArr;
      for(var i = 0;i< xhrArr.length;i++){
        var xhr = xhrArr[i];
        if(xhr.readyState !== 4){ //已完成
          xhr.aborType = 1; //防止发生ajaxError的时候误提示；
          xhr.abort();
        }
        xhr = null;
      }
      commit('RESET_XHR_ARR');
    }
  };

let mutations = {
  ['SET_XHR_ARR'] (state, xhr, rootState){
    state.xhrArr.push(xhr);
  },
  ['RESET_XHR_ARR'] (state, xhr, rootState){
    state.xhrArr = [];
  }
};

let modules = {
  //baseWebSocket
};

export default new Vuex.Store({
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations,
  modules: modules
});
