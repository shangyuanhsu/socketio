<template>
  <div class="msgBox">
    <div class="userImg">
      <img src="" alt="" />
    </div>
    <div class="boxData">
      <div>
        <div class="category">Line</div>
        <div class="time">Monday</div>
      </div>
      <div class="otherUser">Amy</div>
      <div>text msg</div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "MsgBox",
  components: {},
  setup() {
    //開始
    onMounted(() => {});

    return {};
  },
};
</script>

<style scoped>
.msgBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
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
  background-color: rgb(205, 228, 205);
  padding: 2px 4px;
  border-radius: 4px;
}
.boxData .otherUser {
  font-size: 20px;
  font-weight: bold;
}
</style>
