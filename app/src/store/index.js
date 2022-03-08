import { createStore } from 'vuex'
import router from "@/router";

export default createStore({
  state: { // 所有在 store 裏的資料
    userId: null,//使用者id
    userName: "user",//使用者名字
    showRoomId: "",//目前顯示的聊天室編號
    showCusName: "",//對方名字
    showCusId: "",//對方id
    allRoomBox: [],//使用者擁有的聊天室
    chatData: []//當前聊天的內容
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
      fetch('http://localhost:4000/getMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          uid: id,
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        if (data.status === "success") {
          const name = data.result[0].name;
          commit('changeUserId', { id: id, name: name });
          router.push({ name: "home" });
        } else {
          alert("ID ERROR !");
        }
      }).catch((err) => {
        console.log('錯誤:', err);

      })

    },
    // 抓使用者有的聊天紀錄
    selectUserMsgData({ state, commit, dispatch }) {
      let data = [];
      if (state.userId == 1) {
        data = [
          { roomId: "123-234", cusId: 2, name: "Amy", category: "1", msg: "last text", status: "0" },
          { roomId: "123-345", cusId: 3, name: "Tom", category: "2", msg: "last text", status: "1" },
          { roomId: "123-456", cusId: 4, name: "Leo", category: "3", msg: "last text", status: "0" },
        ];
      }
      if (state.userId == 2) {
        data = [
          { roomId: "123-234", cusId: 1, name: "Sara", category: "1", msg: "last text", status: "0" },
        ];
      }
      if (state.userId == 3) {
        data = [
          { roomId: "123-345", cusId: 1, name: "Sara", category: "2", msg: "last text", status: "1" },
        ];
      }
      if (state.userId == 4) {
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
