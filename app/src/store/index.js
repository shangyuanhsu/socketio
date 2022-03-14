import { createStore } from 'vuex'
import router from "@/router";
export default createStore({
  state: { // 所有在 store 裏的資料
    userId: null,//使用者id
    userName: "user",//使用者名字
    permission: 0,//使用者權限
    showRoomId: "",//目前顯示的聊天室編號
    showCusName: "",//對方名字
    showCusId: "",//對方id
    allRoomBox: [],//使用者擁有的聊天室
    chatData: [],//當前聊天的內容
    ham: false,//漢堡選單開關
  },
  mutations: {// 負責改變 state 裏的資料
    changeUserId(state, data) {
      state.userId = data.id;
      state.userName = data.name;
      state.permission = data.permission;
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
    },
    changeHam(state, data) {
      state.ham = data;
    },

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
        // console.log(data);
        if (data.status === "success") {
          const name = data.result[0].name;
          const permission = data.result[0].permission;
          commit('changeUserId', { id: id, name: name, permission: permission });
          router.push({ name: "home" });

        } else {
          alert("ID ERROR !");
        }
      }).catch((err) => {
        console.log('錯誤getMember:', err);
      })
    },
    // 抓使用者有的聊天紀錄
    selectUserMsgData({ state, commit, dispatch }) {

      fetch('http://localhost:4000/getMsgLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          uid: state.userId,
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        if (data.status === "success") {
          console.log(data)
          commit('insertRoomBox', data.result);
          dispatch("insertshowRoomId", data.result[0]);
          dispatch("selectRoomId", data.result[0].roomId);
        }
      }).catch((err) => {
        console.log('錯誤getMember:', err);
      })

    },
    // 聊天室ID
    insertshowRoomId({ commit }, id) {
      commit('updatashowRoomId', id);
    },
    //聊天室內容
    selectRoomId({ commit }, id) {
      fetch(`http://localhost:4000/getRoomIdData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          roomId: id,
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        if (data.status === "success") {
          commit('updatatRoomIdData', data.result);
        }
      }).catch((err) => {
        console.log('錯誤getMember:', err);
      })



      // let data = [];
      // if (id == 1) {
      //   data = [
      //     {
      //       date: "Mar 1th 22",
      //       data: [
      //         {
      //           uid: 2,
      //           name: "Amy",
      //           content: "hello~",
      //           time: "7:31 AM",
      //         },
      //         {
      //           uid: 1,
      //           name: "Sara",
      //           content: "🙌",
      //           time: "7:33 AM",
      //         },
      //         {
      //           uid: 2,
      //           name: "Amy",
      //           content: "I need help",
      //           time: "8:00 AM",
      //         },
      //       ],
      //     },
      //     {
      //       date: "Mar 2th 22",
      //       data: [
      //         {
      //           uid: 1,
      //           name: "Sara",
      //           content: "what happened",
      //           time: "7:25 AM",
      //         },
      //         {
      //           uid: 1,
      //           name: "Sara",
      //           content: "??",
      //           time: "7:40 AM",
      //         },
      //         {
      //           uid: 2,
      //           name: "Amy",
      //           content: "could u teach me vue?",
      //           time: "8:10 AM",
      //         },
      //         {
      //           uid: 2,
      //           name: "Amy",
      //           content: "i can't build vue cli and can't new a project",
      //           time: "8:22 AM",
      //         },
      //         {
      //           uid: 2,
      //           name: "Amy",
      //           content: "do u have time",
      //           time: "9:12 AM",
      //         },
      //       ],
      //     },
      //   ];
      // }


    },
    goChangeHam({ commit }, status) {
      commit('changeHam', status);
    }

  },
  getters: {
    // 像 computed 一樣，運算處理 state 資料
    //==================================================
    getAllRoomBox: (state) => {
      return state.allRoomBox
    },
    getChatData:  (state) => {
      return state.chatData
    }
  },
  modules: {
    // 按需求分拆 module
    // 每個 module 都有自己的state, actions, mutations, getters, modules
  }
})
