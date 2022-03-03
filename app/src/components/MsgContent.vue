<template>
  <div class="msgContent">
    <div class="cusData">
      <div class="cusUserName">Amy</div>
      <div class="cusSet">
        <div>blacklist</div>
        <div class="checked">processing</div>
        <div>completed</div>
      </div>
    </div>
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
    <form>
      <input type="text" v-model="messages" />
      <div class="sendBtn" @click.prevent="sandMsg">
        <img src="../assets/img/send_black_24dp.svg" alt="" />
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, reactive, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { io } from "socket.io-client";
export default {
  name: "MsgContent",
  components: {},
  setup() {
    const store = useStore();
    const uid = ref(null);
    const show = ref(null);
    const isShowBack = ref(false);
    const messages = ref(""); // 輸入的訊息
    const arrMessages = reactive({
      arr: [
        {
          date: "2022-03-01",
          data: [
            {
              uid: 234,
              name: "Amy",
              content: "hello~",
              time: "2022-03-01 11:00",
            },
            {
              uid: 123,
              name: "Sara",
              content: "🙌",
              time: "2022-03-01 11:02",
            },
            {
              uid: 234,
              name: "Amy",
              content: "I need help",
              time: "2022-03-01 11:10",
            },
          ],
        },
        {
          date: "2022-03-02",
          data: [
            {
              uid: 123,
              name: "Sara",
              content: "what happen",
              time: "2022-03-01 11:00",
            },
            {
              uid: 123,
              name: "Sara",
              content: "??",
              time: "2022-03-02 11:02",
            },
            {
              uid: 234,
              name: "Amy",
              content: "could u teach me vue?",
              time: "2022-03-02 11:10",
            },
            {
              uid: 234,
              name: "Amy",
              content: "i can't build vue cli and can't new a project",
              time: "2022-03-02 11:10",
            },
            {
              uid: 234,
              name: "Amy",
              content: "do u have time",
              time: "2022-03-02 11:10",
            },
          ],
        },
      ],
    }); //對話
    const socket = io("http://localhost:3000/room1");
    //開始
    onMounted(() => {
      uid.value = store.state.userId;
      show.value.scrollTo(0, show.value.scrollHeight);

      socket.on("chat message", async function (msg) {
        arrMessages.arr[1].data.push({
          uid: uid,
          name: "Sara",
          content: msg,
          time: "2022-03-02",
        });
        await nextTick();
        goBack();
      });
    });
    // send msg
    const sandMsg = async () => {
      if (messages.value) {
        socket.emit("chat message", messages.value);
        messages.value = "";
      }
    };
    const goBack = () => {
      show.value.scrollTo({
        top: show.value.scrollHeight,
        behavior: "smooth",
      });
      isShowBack.value = false;
    };
    const showBack = () => {
      if (show.value.clientHeight + show.value.scrollTop < show.value.scrollHeight) {
        isShowBack.value = true;
      }
      if (show.value.clientHeight + show.value.scrollTop === show.value.scrollHeight) {
        isShowBack.value = false;
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
    };
  },
};
</script>
<style scoped>
.msgContent {
  position: relative;
}
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
  width: 32px;
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
.goBack img {
  width: 100%;
  opacity: 0.7;
}
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
</style>
