<template>
  <div class="msgSide">
    <div class="search">
      <select name="">
        <option value="0">All</option>
        <option value="1">Facebook</option>
        <option value="2">Line</option>
        <option value="3">Other</option>
      </select>
      <div>
        <img src="../assets/img/search_black_24dp.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "MsgSide",
  components: {},
  setup() {
    //開始
    onMounted(() => {});

    return {};
  },
};
</script>

<style scoped>
.msgSide {
  padding: 8px 10px;
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
select {
  width: 86%;
  padding: 8px 10px;
  font-size: 18px;
  cursor: pointer;
  outline: none;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 20px;
}
.search > div > img {
  width: 38px;
  cursor: pointer;
}
</style>
