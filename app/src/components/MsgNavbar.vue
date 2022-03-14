<template>
  <div class="msgNavbar">
    <div class="hamburgerMenu" @click="showMsgBox">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="userBox">
      <div class="userInfo">
        <b>Hello, {{ userName }}</b>
      </div>
      <div class="userImg"><img src="@/assets/img/user.png" alt="" /></div>
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
    const showMsgBox = () => {
      console.log(store.state.ham);
      store.dispatch("goChangeHam", !store.state.ham);
    };
    return {
      userName,
      showMsgBox,
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
  cursor: pointer;
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
.userImg > img {
  width: 100%;
}
@media (max-width: 955px) {
  .hamburgerMenu span {
    display: block;
  }
}
</style>
