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
