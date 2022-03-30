<template>
  <div class="msgBox">
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
        <div class="time">Monday</div>
      </div>
      <div class="otherUser">{{ cusName }}</div>
      <div>{{ cusMsg }}</div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "MsgBox",
  props: {
    name: String,
    category: Number,
    lastMsg: String,
    img: String,
  },
  setup(props) {
    const cusName = ref("");
    const whichCategory = ref("");
    const cusMsg = ref("");
    const imgUrl = ref("");
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
      cusName.value = props.name;
      cusMsg.value = props.lastMsg;
      imgUrl.value = props.img;
      whichCategory.value = arrSearch.arr.filter(
        (item) => item.id === props.category
      )[0].title;
    });

    return {
      cusName,
      whichCategory,
      cusMsg,
      imgUrl,
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
}
.msgBox:not(:first-child) {
  border-top: 1px solid rgb(243, 243, 243);
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
</style>
