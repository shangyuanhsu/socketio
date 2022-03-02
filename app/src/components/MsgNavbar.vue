<template>
  <div class="msgNavbar">
    <div class="hamburgerMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="userBox">
      <div class="userInfo">
        <b>Hello, {{ userName }}</b>
      </div>
      <div class="userImg"><img src="" alt="" /></div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";

export default {
  name: "MsgNavbar",
  setup() {
    const store = useStore();
    const userName = ref("user");
    onMounted(() => {
      userName.value = store.state.userName;
    });
    return {
      userName,
    };
  },
};
</script>

<style scoped>
.msgNavbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(211, 211, 211);
}
.msgNavbar > div {
  padding: 10px 20px;
}
.hamburgerMenu {
  display: none;
  display: flex;
  flex-direction: column;
}
.hamburgerMenu span {
  display: block;
  width: 42px;
  height: 5px;
  margin: 5px 0;
  border-radius: 4px;
  background: white;
  display: none;
}
.userBox {
  display: flex;
  align-items: center;
}
.userInfo {
  margin: 0 8px;
}
.userImg {
  background: white;
  width: 45px;
  height: 45px;
  border-radius: 70%;
  overflow: hidden;
}
</style>
