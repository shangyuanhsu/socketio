<template>
  <div class="msgContent">
    <!-- status -->
    <div class="cusData">
      <div class="cusUserName">{{ nameCus }}</div>
      <div class="cusSet">
        <div>blacklist</div>
        <div class="checked">processing</div>
        <div>completed</div>
      </div>
    </div>
    <!-- chat box -->
    <ul ref="show" @wheel="showBack">
      <li v-for="(item, ind) in arrMessages.arr" :key="ind">
        <p class="zoneTime">{{ item.date }}</p>
        <div
          v-for="(msg, index) in item.data"
          :key="index"
          :class="[msg.uid === uid ? 'mine' : '']"
        >
          <p class="userName">{{ msg.uid === uid ? "" : msg.name }}</p>
          <div v-if="msg.uid === uid">
            <p class="time">{{ msg.time }}</p>
            <p class="content">{{ msg.content }}</p>
          </div>
          <div v-else>
            <p class="content">{{ msg.content }}</p>
            <p class="time">{{ msg.time }}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="goBack" v-show="isShowBack" @click="goBack">
      <img src="../assets/img/arrow_downward_black_24dp.svg" alt="" />
    </div>
    <!-- send msg -->
    <form>
      <input type="text" v-model="messages" />
      <button class="sendBtn" @click.prevent="sandMsg">
        <img src="../assets/img/send_black_24dp.svg" alt="" />
      </button>
    </form>
  </div>
</template>

<script>
import { onMounted, reactive, ref, nextTick, watchEffect } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import { io } from "socket.io-client";
export default {
  name: "MsgContent",
  components: {},
  props: {
    arrData: Object,
    cusName: String,
  },
  setup() {
    const store = useStore();
    const uid = ref(null);
    const userName = ref(""); // 使用的名字
    const show = ref(null); // 對話框的dom element
    const isShowBack = ref(false); // 回到最訊息的按鈕
    const messages = ref(""); // 輸入的訊息
    const roomId = ref("");
    const nameCus = ref("");
    const arrMessages = reactive({ arr: [] }); // 對話data

    const socket = io("http://localhost:3000/"); // 聊天室連線

    // 開始
    onMounted(() => {
      console.log(socket);
      uid.value = store.state.userId;
      userName.value = store.state.userName;
      roomId.value = store.state.showRoomId;
      init();
    });

    const init = () => {
      console.log(roomId.value);
      // 加入聊天室
      socket.emit("joinRoom", { username: uid.value, room: roomId.value });
      //  發送訊息
      socket.on("chatMessage", async function (id, name, msg, time) {
        // 最新的訊息推到畫面裡
        console.log(roomId.value);
        const date = moment().format("MMM Do YY");
        if (arrMessages.arr.length > 0) {
          if (arrMessages.arr[arrMessages.arr.length - 1].date === date) {
            arrMessages.arr[arrMessages.arr.length - 1].data.push({
              uid: id,
              name: name,
              content: msg,
              time: time,
            });
          } else {
            arrMessages.arr[arrMessages.arr.length] = {
              date: date,
              data: [
                {
                  uid: id,
                  name: name,
                  content: msg,
                  time: time,
                },
              ],
            };
          }
        } else {
          arrMessages.arr[0] = {
            date: date,
            data: [
              {
                uid: id,
                name: name,
                content: msg,
                time: time,
              },
            ],
          };
        }

        await nextTick(); // 整理data(for updataing chatbox dom)
        goBack();
      });
    };

    watchEffect(async () => {
      nameCus.value = store.state.showCusName;
      arrMessages.arr = store.state.chatData.map((item) => item);
      await nextTick();
      show.value.scrollTo(0, show.value.scrollHeight);
    });

    // 發送訊息
    const sandMsg = () => {
      const sendTime = moment().format("LT"); // 發送時間
      if (messages.value) {
        socket.emit("chatMessage", uid.value, userName.value, messages.value, sendTime);
        messages.value = "";
      }
    };
    // 滑到最新的訊息
    const goBack = () => {
      show.value.scrollTo({
        top: show.value.scrollHeight,
        behavior: "smooth",
      });
      isShowBack.value = false;
    };
    // 顯示/隱藏回到最新消息的按鈕
    const showBack = () => {
      // 滾輪不在底時
      if (show.value.clientHeight + show.value.scrollTop < show.value.scrollHeight) {
        isShowBack.value = true;
      }
      // 滾輪到底時
      if (show.value.clientHeight + show.value.scrollTop === show.value.scrollHeight) {
        isShowBack.value = false;
      }
      // 滾輪到最上面時
      if (show.value.scrollTop == 0) {
        olderMsg(); // 要去撈更舊的對話紀錄
      }
    };
    // 滾輪到最上面時，要去撈更舊的對話紀錄 (模擬)
    const olderMsg = () => {
      const newMsgData = {
        date: "2022-02-28",
        data: [
          {
            uid: 234,
            name: "Amy",
            content: "DB go test1",
            time: "7:31 AM",
          },
          {
            uid: 123,
            name: "Sara",
            content: "DB go test2",
            time: "7:33 AM",
          },
          {
            uid: 234,
            name: "Amy",
            content: "DB go test3",
            time: "8:00 AM",
          },
        ],
      };
      arrMessages.arr.unshift(newMsgData);
    };

    return {
      messages,
      arrMessages,
      sandMsg,
      uid,
      show,
      showBack,
      isShowBack,
      goBack,
      nameCus,
    };
  },
};
</script>
<style scoped>
.msgContent {
  position: relative;
}
/* 狀態列 */
.cusData,
.cusSet {
  display: flex;
}
.cusData {
  align-items: center;
  padding: 20px 10px;
  border-bottom: 1px solid rgb(209, 209, 209);
  width: 90%;
  justify-content: space-between;
  margin: 10px auto 30px auto;
}
.cusSet div {
  width: 100px;
  text-align: center;
  padding: 5px 8px;
  margin-left: 5px;
  border-radius: 20px;
  border: 1px solid rgb(228, 228, 228);
  cursor: pointer;
}
.cusUserName {
  font-size: 20px;
  font-weight: bold;
}
.checked {
  background: rgb(228, 228, 228);
}
/* chat box */
ul {
  width: 92%;
  margin: 20px auto;
  padding: 10px;
  height: calc(100vh - 250px);

  overflow-x: hidden;
  overflow-y: auto;
}

ul::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/*滾動條裡面小方塊樣式*/
ul::-webkit-scrollbar-thumb {
  border-radius: 100px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgb(212, 212, 212);
}

/*滾動條裡面軌道樣式*/
ul::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(189, 189, 189, 0.1);
}

/* 傳訊息 */
form {
  width: 94%;
  padding: 8px 12px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
form input[type="text"] {
  width: calc(100% - 32px);
}
.sendBtn {
  width: 42px;
  border-radius: 0;
  background: none;
}
.sendBtn img {
  width: 100%;
  opacity: 0.7;
}
li {
  padding: 5px 8px;
  list-style-type: none;
}
li > div {
  width: 70%;
  margin: 20px 0;
}
li .mine {
  margin-left: auto;
}
li > div > div {
  display: flex;
  align-items: flex-end;
}
li > .mine > div {
  justify-content: flex-end;
}
.time {
  font-size: 10px;
  margin-bottom: 2px;
  min-width: 100px;
}
.content {
  padding: 5px 8px;
  border-radius: 8px;
  border: 1px solid rgb(209, 209, 209);
  margin: 2px 4px 0 0;
  position: relative;
  word-break: break-word;
}
.mine .content {
  background: none;
  margin: 2px 0 0 4px;
  background: rgb(209, 209, 209);
}
.mine .time {
  text-align: right;
}
.zoneTime {
  text-align: center;
  font-size: 8px;
  background: rgb(241, 241, 241);
  border-radius: 20px;
  padding: 2px;
}
.zoneTime:not(:first-child) {
  margin: 30px 0 20px 0;
}
.userName {
  font-size: 14px;
}
.goBack {
  position: absolute;
  bottom: 70px;
  right: 70px;
  text-align: center;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 70%;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
/* 回到最新訊息的按鈕 */
.goBack img {
  width: 100%;
  opacity: 0.7;
}
</style>
