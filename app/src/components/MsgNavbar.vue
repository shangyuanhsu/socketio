<template>
  <div class="msgNavbar">
    <div class="hamburgerMenu" @click="showMsgBox">
      <span :class="{ pHam: showHam }"></span>
      <span :class="{ pHam: showHam }"></span>
      <span :class="{ pHam: showHam }"></span>
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
import { onMounted, ref, computed } from "vue";

export default {
  name: "MsgNavbar",
  setup() {
    const store = useStore();
    const userName = ref("user");
    onMounted(() => {
      userName.value = store.state.userName;
      window.addEventListener("resize", () => {
        if (window.innerWidth > 955) {
          store.dispatch("goChangeHam", false);
        }
      });
    });
    const showMsgBox = () => {
      console.log(store.state.ham);
      store.dispatch("goChangeHam", !store.state.ham);
    };

    const showHam = computed(() => {
      return store.getters.getHam;
    });

    return {
      userName,
      showMsgBox,
      showHam,
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
  .hamburgerMenu span:not(:nth-child(2)) {
    transition: all 0.5s;
  }
  .pHam:first-child {
    transform: rotate(45deg);
    transform-origin: 0 0;
    position: relative;
    top: 1px;
    left: 4px;
  }
  .pHam:nth-child(2) {
    visibility: hidden;
  }
  .pHam:last-child {
    transform: rotate(-45deg);
    transform-origin: 0 0;
  }
}
</style>
