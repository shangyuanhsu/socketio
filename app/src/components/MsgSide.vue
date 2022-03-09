<template>
  <div class="msgSide">
    <MsgSearch @whichSearch="whichSearch" v-if="isPermission" />
    <MsgSet @whichProcess="whichProcess" />
    <div class="allMsgBox">
      <MsgBox
        v-for="(item, index) in arrMyFriendBox.arr"
        :key="index"
        :name="item.name"
        :category="item.category"
        :lastMsg="item.msg"
        v-show="process === item.status && (search === item.category || search === '0')"
        @click="showRoom(item.roomId, item.name)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import MsgSearch from "@/components/MsgSearch.vue";
import MsgSet from "@/components/MsgSet.vue";
import MsgBox from "@/components/MsgBox.vue";

export default {
  name: "MsgSide",
  components: {
    MsgSearch,
    MsgSet,
    MsgBox,
  },
  emits: ["updataChatData"],
  setup(props, context) {
    const store = useStore();
    const isPermission = ref(false);
    const process = ref(0);
    const search = ref(0);
    const arrMyFriendBox = reactive({ arr: [] });
    //開始
    onMounted(() => {
      isPermission.value = store.state.permission === 1;
      store.dispatch("selectUserMsgData");
      arrMyFriendBox.arr = store.state.allRoomBox.map((item) => item);
    });
    const showRoom = (roomId, name) => {
      store.dispatch("insertshowRoomId", { roomId, name });
      context.emit("updataChatData", roomId);
    };
    const whichSearch = (id) => {
      search.value = String(id);
      console.log(search.value);
    };
    const whichProcess = (id) => {
      process.value = String(id);
    };

    return {
      arrMyFriendBox,
      showRoom,
      whichProcess,
      process,
      whichSearch,
      search,
      isPermission,
    };
  },
};
</script>

<style scoped>
.msgSide {
  height: calc(100vh - 65px);
  padding: 8px 20px;
  border-right: 1px solid rgb(228, 228, 228);
}
.allMsgBox {
  border: 1px solid rgb(228, 228, 228);
  height: calc(100vh - 223px);
  overflow-y: auto;
}

.allMsgBox::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/*滾動條裡面小方塊樣式*/
.allMsgBox::-webkit-scrollbar-thumb {
  border-radius: 100px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgb(212, 212, 212);
}

/*滾動條裡面軌道樣式*/
.allMsgBox::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(189, 189, 189, 0.1);
}

@media (max-width: 955px) {
  .msgSide {
    position: absolute;
    left: -400px;
  }
}
</style>
