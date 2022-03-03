<template>
  <div class="msgSide">
    <MsgSearch />
    <MsgSet />
    <div class="allMsgBox">
      <MsgBox
        v-for="(item, index) in arrMyFriendBox.arr"
        :key="index"
        :name="item.name"
        :category="item.category"
        :lastMsg="item.msg"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
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
  setup() {
    const arrMyFriendBox = reactive({
      arr: [
        { name: "Amy", category: "1", msg: "last text" },
        { name: "Tom", category: "2", msg: "last text" },
        { name: "Leo", category: "3", msg: "last text" },
      ],
    });
    //開始
    onMounted(() => {});

    return {
      arrMyFriendBox,
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
</style>
