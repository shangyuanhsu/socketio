<template>
  <div :class="[checkRoomId === roomId ? 'msgBox check' : 'msgBox']">
    <div class="userImg">
      <img :src="imgUrl" alt="" />
    </div>
    <div class="boxData">
      <div>
        <div
          :class="[
            { category },
            whichCategory === 'Facebook'
              ? 'categoryFb'
              : whichCategory === 'Line'
              ? 'categoryLine'
              : '',
          ]"
        >
          {{ whichCategory }}
        </div>
        <div class="time">{{ time }}</div>
      </div>
      <div class="otherUser">{{ cusName }}</div>
      <div class="cusMsg">{{ cusMsg }}</div>
    </div>
    <div class="wram" v-show="isRead">!</div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "MsgBox",
  props: {
    name: String,
    category: Number,
    lastMsg: String,
    img: String,
    createtime: String,
    read: Boolean,
    thisRoomId: Number,
  },
  setup(props) {
    const store = useStore();

    const checkRoomId = ref(0);
    const cusName = ref("");
    const whichCategory = ref("");
    const cusMsg = ref("");
    const imgUrl = ref("");
    const time = ref("");
    const isRead = ref(false);
    const arrSearch = {
      arr: [
        { id: 0, title: "All" },
        { id: 1, title: "Facebook" },
        { id: 2, title: "Line" },
        { id: 3, title: "Other" },
      ],
    };
    //開始
    onMounted(() => {
      checkRoomId.value = props.thisRoomId;
      cusName.value = props.name;
      cusMsg.value = props.lastMsg;
      imgUrl.value = props.img;
      time.value = props.createtime;
      isRead.value = props.read;

      whichCategory.value = arrSearch.arr.filter(
        (item) => item.id === props.category
      )[0].title;
      console.log("msgBox", roomId.value, "/", checkRoomId.value);
    });
    const roomId = computed(() => {
      return store.state.showRoomId;
    });

    return {
      cusName,
      whichCategory,
      cusMsg,
      imgUrl,
      time,
      checkRoomId,
      roomId,
      isRead,
    };
  },
};
</script>

<style scoped>
.msgBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
  cursor: pointer;
  position: relative;
}
.wram {
  position: absolute;
  bottom: 24px;
  right: 20px;
  padding: 2px 9px;
  border-radius: 70%;
  background-color: rgb(250, 210, 210);
  color: brown;
}
.msgBox.check {
  background-color: rgba(240, 240, 240, 0.527);
}
.msgBox:not(:first-child) {
  border-bottom: 1px solid rgb(243, 243, 243);
}
.userImg {
  margin: 0 4px;
  width: 65px;
  height: 65px;
  background: gray;
  border-radius: 70%;
  overflow: hidden;
}
.userImg > img {
  width: 100%;
}
.boxData {
  width: 70%;
  margin: 0 8px;
}
.boxData > div {
  margin: 6px 0;
}
.boxData > div:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
}
.category {
  background-color: rgb(237, 237, 237);

  padding: 2px 4px;
  border-radius: 4px;
}
.categoryLine {
  background-color: rgb(213, 244, 213);
}
.categoryFb {
  background-color: rgb(202, 222, 235);
}
.boxData .otherUser {
  font-size: 20px;
  font-weight: bold;
}
.cusMsg {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 170px;
}
</style>
