import { createStore } from 'vuex'

export default createStore({
  state: { // 所有在 store 裏的資料
    userId: null,//使用者id
    userName: "user"
  },
  mutations: {// 負責改變 state 裏的資料
    changeUserId(state, data) {
      state.userId = data.id;
      state.userName = data.name;
    }

  },
  actions: {
    // 負責觸發 mutations
    // ajax 要在 Actions 裡面做，不可以在 Mutations 裡面做
    // 可處理非同步程式（e.g: 打 API）
    //==================================================
    insertUserId({ commit }, id) {
      const name = id ? "Sara" : "user";
      commit('changeUserId', { id: id, name: name });
    }
  },
  getters: {
    // 像 computed 一樣？？，運算處理 state 資料
    //==================================================
  },
  modules: {
    // 按需求分拆 module
    // 每個 module 都有自己的state, actions, mutations, getters, modules
  }
})
