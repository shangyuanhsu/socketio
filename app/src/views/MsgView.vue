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
    // const componentKey = ref(0);
    const socket = io("http://localhost:3000/"); // 聊天室連線
    //開始
    onMounted(() => {
      if (!store.state.userId) {
        socket.on("disconnect");
        alert("ID ERROR !");
        router.push({ name: "login" });
      } else {
        // console.log("showRoomId", store.state.showRoomId);
        updataChatData(store.state.showRoomId);
      }

      // 有沒有訊息現在在server上
      socket.emit("checkedNewMsg", store.state.userId);
      socket.on("checkedNewMsg", function () {
        // console.log(data);
      });
    });

    const componentKey = computed(() => {
      return store.state.showRoomId;
    });

    const updataChatData = (roomId) => {
      console.log("updataChatData roomId", roomId);
      store.dispatch("selectRoomId", roomId);
      // console.log(" store.state.showRoomId", store.state.showRoomId);

      // componentKey.value = roomId;
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
