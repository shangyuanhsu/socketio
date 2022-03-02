<template>
  <div class="home">
    <MsgNavbar />
    <main>
      <MsgSide />
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

    // {
    //   id: 0,
    //   uid: 234,
    //   time: "2022-03-02",
    //   lastChat: "ok! Thank you",
    //   chat: [
    //     { uid: 234, content: "ok! Thank you" },
    //     { uid: 123, content: "yoyo" },
    //     { uid: 234, content: "hello" },
    //   ],
    //   process: 0,
    //   media: 2,
    // },

    //開始
    onMounted(() => {
      if (!store.state.userId) {
        router.push({ name: "login" });
      }
    });

    return {};
  },
};
</script>
<style scoped>
main {
  display: grid;
  grid-template-columns: 380px 1fr;
}
</style>
