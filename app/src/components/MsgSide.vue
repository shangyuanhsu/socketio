<template>
  <div :class="['msgSide', { showLeft: showHam }]">
    <MsgSearch @whichSearch="whichSearch" v-if="isPermission" />
    <MsgSet @whichProcess="whichProcess" />
    <div class="allMsgBox">
      <MsgBox
        v-for="item in arrMyFriendBox"
        :key="item.roomId"
        :thisRoomId="item.roomId"
        :name="item.name"
        :createtime="item.createtime"
        :category="item.category"
        :read="item.read"
        :lastMsg="item.msg"
        :img="require('@/assets/' + item.img)"
        v-show="process === item.status && (search === item.category || search === 0)"
        @click="showRoom(item.roomId, item.name, item.cusId)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, nextTick } from "vue";
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
    //開始
    onMounted(async () => {
      await nextTick();
      isPermission.value = store.state.permission === 1;
      store.dispatch("selectUserMsgData");
    });

    // 渲染側邊聊天室
    const arrMyFriendBox = computed(() => {
      return store.getters.getAllRoomBox;
    });

    // 預選最上面的開啟
    const showRoom = (roomId, name, cusId) => {
      store.dispatch("insertshowRoomId", { roomId, name, cusId });
      context.emit("updataChatData", roomId);
    };

    // 看哪一種聊天來源
    const whichSearch = (id) => {
      search.value = id;
    };

    // 側邊進度到哪
    const whichProcess = (id) => {
      process.value = id;
    };

    const showHam = computed(() => {
      return store.getters.getHam;
    });

    return {
      arrMyFriendBox,
      showRoom,
      whichProcess,
      process,
      whichSearch,
      search,
      isPermission,
      showHam,
    };
  },
};
</script>

<style scoped>
.msgSide {
  background: #fff;
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
    width: 380px;
    position: absolute;
    left: -400px;
    z-index: 5;
    transition: left 0.5s;
  }
  .showLeft {
    left: 0;
    z-index: 5;
  }
}
</style>
