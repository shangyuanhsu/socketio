import { createStore } from 'vuex'
import router from "@/router";
export default createStore({
  state: {
    userId: null,//使用者id
    userName: "user",//使用者名字
    permission: 0,//使用者權限
    showRoomId: 0,//目前顯示的聊天室編號
    showCusName: "",//對方名字
    showCusId: "",//對方id
    allRoomBox: [],//使用者擁有的聊天室
    chatData: [],//當前聊天的內容
    ham: false,//漢堡選單開關
  },
  mutations: {
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
        console.log(data);
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
          // console.log("getMsgLog",data)
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
      console.log(id)
      fetch(`http://localhost:4000/getRoomIdData?${Math.random() * 1000}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          roomId: id,
        }),
        cache: 'no-cache'
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log("getRoomIdData", data)
        if (data.status === "success") {
          commit('updatatRoomIdData', data.result);
        } else {
          commit('updatatRoomIdData', []);
        }
      }).catch((err) => {
        console.log('錯誤getMember:', err);
      })
    },
    goChangeHam({ commit }, status) {
      commit('changeHam', status);
    },
    insertMsg({ commit }, data) {
      console.log(commit);
      // console.log("insertMsg",data);
      fetch(`http://localhost:4000/insertMsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          data: JSON.parse(data),
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log("insertMsg", data)

      }).catch((err) => {
        console.log('insertMsg:', err);
      })
    }

  },
  getters: {
    // 像 computed 一樣，運算處理 state 資料
    //==================================================
    getShowRoom: (state) => {
      return { showRoomId: state.showRoomId, showCusName: state.showCusName }
    },
    getAllRoomBox: (state) => {
      return state.allRoomBox
    },
    getChatData: (state) => {
      return state.chatData
    },
    getHam: (state) => {
      return state.ham
    }
  },
  modules: {
    // 按需求分拆 module
    // 每個 module 都有自己的state, actions, mutations, getters, modules
  }
})
