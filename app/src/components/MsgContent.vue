<template>
  <div class="msgContent">
    <ul v-for="(msg, index) in arrMessages.arr" :key="index">
      <li>{{ msg }}</li>
    </ul>
    <form>
      <input type="text" v-model="messages" />
      <button @click.prevent="sandMsg">Send</button>
    </form>
  </div>
</template>

<script>

import { onMounted, reactive, ref } from "vue";
import { io } from "socket.io-client";
export default {
  name: "MsgContent",
  components: {
  
  },
  setup() {

    const messages = ref(""); // 輸入的訊息
    const arrMessages = reactive({ arr: ["messages1", "messages2"] }); //對話
    const socket = io("http://localhost:3000/");
    //開始
    onMounted(() => {
  
        socket.on("chat message", function (msg) {
          arrMessages.arr.push(msg);
          window.scrollTo(0, document.body.scrollHeight);
        });
    
    });
    const sandMsg = () => {
      console.log(messages.value);
      if (messages.value) {
        socket.emit("chat message", messages.value);
        messages.value = "";
      }
    };

    return {
      messages,
      arrMessages,
      sandMsg,
    };
  },
};
</script>
