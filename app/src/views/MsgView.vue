<template>
  <div class="home">
    <MsgNavbar />
    <main>
      <MsgSide @updataChatData="updataChatData" />
      <MsgContent :key="componentKey" />
    </main>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import router from "@/router";
import MsgNavbar from "@/components/MsgNavbar.vue";
import MsgSide from "@/components/MsgSide.vue";
import MsgContent from "@/components/MsgContent.vue";
import { io } from "socket.io-client";
export default {
  name: "MsgView",
  components: {
    MsgNavbar,
    MsgSide,
    MsgContent,
  },
  setup() {
    const store = useStore();
    const socket = io("http://localhost:3000/"); // 聊天室連線

    //開始
    onMounted(() => {
      if (!store.state.userId) {
        socket.on("disconnect");
        alert("ID ERROR !");
        router.push({ name: "login" });
      } else {
        updataChatData(store.state.showRoomId);
      }
    });

    const componentKey = computed(() => {
      return store.state.showRoomId;
    });

    const updataChatData = (roomId) => {
      console.log("updataChatData roomId", roomId);
      store.dispatch("selectRoomId", roomId);
    };

    return {
      updataChatData,
      componentKey,
    };
  },
};
</script>
<style scoped>
main {
  display: grid;
  grid-template-columns: 380px 1fr;
}

@media (max-width: 955px) {
  main {
    grid-template-columns: 1fr;
  }
}
</style>
