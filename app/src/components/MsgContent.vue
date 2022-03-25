<template>
  <div class="msgContent">
    <!-- status -->
    <div class="cusData">
      <div class="cusUserName">{{ nameCus }}</div>
      <div class="cusSet" v-if="isPermission">
        <div>blacklist</div>
        <div class="checked">processing</div>
        <div>completed</div>
      </div>
    </div>
    <div class="allChat">
      <!-- chat box -->
      <ul ref="show" @wheel="showBack">
        <li v-for="(item, ind) in arrMessages.arr" :key="ind">
          <p class="zoneTime">
            {{ item.date === todayDate ? "today" : item.date }}
          </p>
          <div
            v-for="(msg, index) in item.data"
            :key="index"
            :class="[msg.uid === uid ? 'mine' : '']"
          >
            <p class="userName">{{ msg.uid === uid ? "" : nameCus }}</p>
            <div v-if="msg.uid === uid">
              <p class="time">{{ msg.createtime }}</p>
              <p class="content" v-html="msg.msgContent"></p>
            </div>
            <div v-else>
              <p class="content" v-html="msg.msgContent"></p>
              <p class="time">{{ msg.createtime }}</p>
            </div>
          </div>
        </li>
      </ul>

      <!-- send msg -->
      <form>
        <textarea
          v-model="messages"
          rows="1"
          ref="moreHeightDom"
          @keyup.enter="moreHeight"
          @keyup.delete="checkmoreHeight"
        ></textarea>
        <label class="upImg" for="upImg">
          <img src="../assets/img/collections_black_24dp.svg" alt="" />
        </label>
        <input id="upImg" type="file" />
        <button class="sendBtn" @click.prevent="sandMsg">
          <img src="../assets/img/send_black_24dp.svg" alt="" />
        </button>
      </form>
    </div>
    <div class="goBack" v-show="isShowBack" @click="goBack">
      <img src="../assets/img/arrow_downward_black_24dp.svg" alt="" />
    </div>
    <div class="bg" v-if="showHam"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, nextTick, computed, watch } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import { io } from "socket.io-client";

export default {
  name: "MsgContent",
  components: {},
  props: {},
  setup() {
    const store = useStore();
    const uid = ref(null); // 使用者ID
    const isPermission = ref(false); // 使用者權限
    const userName = ref(""); //使用者名字
    const show = ref(null); // 對話框的dom element
    const moreHeightDom = ref(null); // textarea 的dom element
    const isShowBack = ref(false); // 回到最訊息的按鈕
    const messages = ref(""); // 輸入的訊息
    const roomId = ref(""); // 跟哪一位聊天
    const nameCus = ref(""); // 聊天對像的名字
    const cusId = ref(""); // 聊天對像的ID
    const arrMessages = reactive({ arr: [] }); // 對話data
    const todayDate = ref("");

    const socket = io("http://localhost:3000/"); // 聊天室連線

    // 開始
    onMounted(() => {
      todayDate.value = moment().format("MMM Do YY");
      uid.value = store.state.userId;
      userName.value = store.state.userName;
      roomId.value = store.state.showRoomId;
      nameCus.value = store.state.showCusName;
      cusId.value = store.state.showCusId;
      isPermission.value = store.state.permission === 1;
      console.log("onMounted", roomId.value);
      // arrMessages.arr = store.state.chatData;
      console.log("a");
      arrMessages.arr = a;
      init();
    });

    const a = computed(() => {
      return store.getters.getChatData;
    });

    const showHam = computed(() => {
      return store.getters.getHam;
    });

    onUnmounted(() => {
      console.log("unmounted", arrMessages); // 存資料庫
    });

    watch(
      () => arrMessages.arr,
      async () => {
        console.log("b");
        await nextTick();
        goBack();
      }
    );

    const init = async () => {
      // 加入聊天室
      socket.emit("joinRoom", { username: uid.value, room: roomId.value });

      //  發送訊息
      socket.on("chatMessage", async function (id, cusId, name, msg, time) {
        // 最新的訊息推到畫面裡
        // console.log(roomId.value);
        if (arrMessages.arr.length > 0) {
          if (
            arrMessages.arr[arrMessages.arr.length - 1].date === todayDate.value ||
            arrMessages.arr[arrMessages.arr.length - 1].date === "today"
          ) {
            arrMessages.arr[arrMessages.arr.length - 1].data.push({
              uid: id,
              name: name,
              msgContent: msg,
              createtime: time,
            });
          } else {
            arrMessages.arr[arrMessages.arr.length] = {
              date: "today",
              data: [
                {
                  uid: id,
                  name: name,
                  msgContent: msg,
                  createtime: time,
                },
              ],
            };
          }
        } else {
          arrMessages.arr[0] = {
            date: todayDate.value,
            data: [
              {
                uid: id,
                name: name,
                msgContent: msg,
                createtime: time,
              },
            ],
          };
        }
        await nextTick();
        goBack();
      });
    };

    // 發送訊息
    const sandMsg = () => {
      const sendTime = moment().format("LT"); // 發送時間
      if (messages.value.replace(/\s+/g || /\r\n|\n/g, "")) {
        socket.emit(
          "chatMessage",
          uid.value,
          cusId.value,
          uid.value,
          messages.value.replace(/\r\n|\n/g, "<br />"),
          sendTime
        );
        socket.emit("checkedNewMsg", uid.value);
      }
      messages.value = "";
      moreHeightDom.value.rows = 1;
    };
    // 滑到最新的訊息
    const goBack = () => {
      if (show.value) {
        show.value.scrollTo({
          top: show.value.scrollHeight,
          behavior: "smooth",
        });
        isShowBack.value = false;
      }
    };
    // 顯示/隱藏回到最新消息的按鈕
    const showBack = (e) => {
      // 滾輪不在底時
      if (show.value.clientHeight + show.value.scrollTop < show.value.scrollHeight) {
        isShowBack.value = true;
      }
      // 滾輪到底時
      if (show.value.clientHeight + show.value.scrollTop === show.value.scrollHeight) {
        isShowBack.value = false;
      }
      // 滾輪到最上面時
      if (show.value.scrollTop == 0 && e.deltaY < 0) {
        olderMsg(); // 要去撈更舊的對話紀錄
      }
    };
    // 滾輪到最上面時，要去撈更舊的對話紀錄 (模擬)
    const olderMsg = () => {
      // const newMsgData = {
      //   date: "2022-02-28",
      //   data: [
      //     {
      //       uid: 2,
      //       name: "Amy",
      //       content: "DB go test1",
      //       time: "7:31 AM",
      //     },
      //     {
      //       uid: 1,
      //       name: "Sara",
      //       content: "DB go test2",
      //       time: "7:33 AM",
      //     },
      //     {
      //       uid: 2,
      //       name: "Amy",
      //       content: "DB go test3",
      //       time: "8:00 AM",
      //     },
      //   ],
      // };
      // arrMessages.arr.unshift(newMsgData); // 塞到陣列的最前面
    };

    // 發送訊息的框框變大
    const moreHeight = () => {
      if (moreHeightDom.value.rows < 8) {
        moreHeightDom.value.rows += 1;
      }
    };

    const checkmoreHeight = () => {
      console.log(messages.value);
      if (!messages.value) {
        moreHeightDom.value.rows = 1;
      }
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
      moreHeight,
      moreHeightDom,
      checkmoreHeight,
      isPermission,
      todayDate,
      showHam,
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
  width: 94%;
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
  padding: 4px 0;
}
.checked {
  background: rgb(228, 228, 228);
}
.allChat {
  height: calc(100vh - 177px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* chat box */
ul {
  width: 95%;
  margin: 5px auto;
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
  width: 100%;
  padding: 8px 12px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: rgb(233, 233, 233);
}
form textarea {
  width: calc(100% - 32px);
  padding: 8px 40px 8px 10px;
  margin: 0 5px 0 0;
  border: 1px solid rgb(184, 183, 183);
  outline: none;
  border-radius: 20px;
  resize: none;
}

textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/*滾動條裡面小方塊樣式*/
textarea::-webkit-scrollbar-thumb {
  border-radius: 100px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgb(212, 212, 212);
}

/*滾動條裡面軌道樣式*/
textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(189, 189, 189, 0.1);
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
#upImg {
  position: absolute;
  visibility: hidden;
}
.upImg {
  cursor: pointer;
}

.bg {
  position: absolute;
  background-color: rgba(59, 59, 59, 0.329);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
}
@media (max-width: 955px) {
  .bg {
    display: block;
  }
}
</style>
