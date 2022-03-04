<template>
  <div class="home">
    <MsgNavbar />
    <main>
      <MsgSide @updataChatData="updataChatData" />
      <MsgContent />
    </main>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted } from "vue";
import router from "@/router";
import MsgNavbar from "@/components/MsgNavbar.vue";
import MsgSide from "@/components/MsgSide.vue";
import MsgContent from "@/components/MsgContent.vue";
export default {
  name: "MsgView",
  components: {
    MsgNavbar,
    MsgSide,
    MsgContent,
  },
  setup() {
    const store = useStore();

    //開始
    onMounted(() => {
      if (!store.state.userId) {
        alert("ID ERROR !");
        router.push({ name: "login" });
      } else {
        updataChatData(store.state.showRoomId);
      }
    });
    const updataChatData = (roomId) => {
      store.dispatch("selectRoomId", roomId);
    };

    return {
      updataChatData,
    };
  },
};
</script>
<style scoped>
main {
  display: grid;
  grid-template-columns: 380px 1fr;
}
</style>
