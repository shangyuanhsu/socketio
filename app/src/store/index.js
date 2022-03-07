import { createStore } from 'vuex'

export default createStore({
  state: { // 所有在 store 裏的資料
    userId: null,//使用者id
    userName: "user",
    showRoomId: "",
    showCusName: "",
    showCusId: "",
    allRoomBox: [],
    chatData: []
  },
  mutations: {// 負責改變 state 裏的資料
    changeUserId(state, data) {
      state.userId = data.id;
      state.userName = data.name;
    },
    insertRoomBox(state, data) {
      state.allRoomBox = data;
    },
    updatashowRoomId(state, data) {

      state.showRoomId = data.roomId;
      state.showCusName = data.name;
      state.showCusId = data.cusId;
    },
    updatatRoomIdData(state, data) {
      state.chatData = data;
    }

  },
  actions: {
    // 負責觸發 mutations
    // ajax 要在 Actions 裡面做，不可以在 Mutations 裡面做
    // 可處理非同步程式（e.g: 打 API）
    //==================================================
    // 寫入使用者的ID和名字
    insertUserId({ commit }, id) {
      const userdata = [
        { id: 123, name: "Sara" },
        { id: 234, name: "Amy" },
        { id: 345, name: "Tom" },
        { id: 456, name: "Loe" },
      ]
      const who = userdata.filter(user => user.id === id);
      if (who.length !== 0) {
        const name = who.length !== 0 ? who[0].name : "user";
        commit('changeUserId', { id: id, name: name });
      }
    },
    // 抓使用者有的聊天紀錄
    selectUserMsgData({ state, commit, dispatch }) {
      let data = [];
      if (state.userId === 123) {
        data = [
          { roomId: "123-234",cusId:234, name: "Amy", category: "1", msg: "last text", status: "0" },
          { roomId: "123-345",cusId:345, name: "Tom", category: "2", msg: "last text", status: "1" },
          { roomId: "123-456",cusId:456, name: "Leo", category: "3", msg: "last text", status: "0" },
        ];
      }
      if (state.userId === 234) {
        data = [
          { roomId: "123-234",cusId:123, name: "Sara", category: "1", msg: "last text", status: "0" },
        ];
      }
      if (state.userId === 345) {
        data = [
          { roomId: "123-345",cusId:123, name: "Sara", category: "2", msg: "last text", status: "1" },
        ];
      }
      if (state.userId === 456) {
        data = [
         
        ];
      }

      commit('insertRoomBox', data);
      if (state.userId) {
        dispatch("insertshowRoomId", data[0]);
        dispatch("selectRoomId", data[0].roomId);
      }

    },
    insertshowRoomId({ commit }, id) {
      commit('updatashowRoomId', id);
    },
    selectRoomId({ commit }, id) {

      let data = [];
      if (id === "123-234") {
        data = [
          {
            date: "Mar 1th 22",
            data: [
              {
                uid: 234,
                name: "Amy",
                content: "hello~",
                time: "7:31 AM",
              },
              {
                uid: 123,
                name: "Sara",
                content: "🙌",
                time: "7:33 AM",
              },
              {
                uid: 234,
                name: "Amy",
                content: "I need help",
                time: "8:00 AM",
              },
            ],
          },
          {
            date: "Mar 2th 22",
            data: [
              {
                uid: 123,
                name: "Sara",
                content: "what happened",
                time: "7:25 AM",
              },
              {
                uid: 123,
                name: "Sara",
                content: "??",
                time: "7:40 AM",
              },
              {
                uid: 234,
                name: "Amy",
                content: "could u teach me vue?",
                time: "8:10 AM",
              },
              {
                uid: 234,
                name: "Amy",
                content: "i can't build vue cli and can't new a project",
                time: "8:22 AM",
              },
              {
                uid: 234,
                name: "Amy",
                content: "do u have time",
                time: "9:12 AM",
              },
            ],
          },
        ];
      }
      if (id === "123-345") {
        data = [
          {
            date: "Mar 1th 22",
            data: [
              {
                uid: 234,
                name: "Tom",
                content: "hello~",
                time: "7:31 AM",
              },
              {
                uid: 123,
                name: "Sara",
                content: "🙌",
                time: "7:33 AM",
              },
              {
                uid: 234,
                name: "Tom",
                content: "I need help",
                time: "8:00 AM",
              },
            ],
          },

        ];
      }

      commit('updatatRoomIdData', data);
    },

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
