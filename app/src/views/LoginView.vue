<template>
  <div class="login">
    <form>
      Please enter user ID : <input v-model="uid" type="text" required />
      <button @click.prevent="getUserId">confirm</button>
    </form>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";

export default {
  name: "LoginView",
  setup() {
    const store = useStore();
    const socket = io("http://localhost:3000/"); // 聊天室連線

    const uid = ref(""); //輸入使用者ID
    onMounted(() => {
      socket.on("disconnect");
    });
    // 使用者輸入ID
    const getUserId = () => {
      store.dispatch("insertUserId", Number(uid.value));
    };
    return {
      uid,
      getUserId,
    };
  },
};
</script>

<style scoped>
.login {
  text-align: center;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
