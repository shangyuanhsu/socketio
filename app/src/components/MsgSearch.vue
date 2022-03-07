<template>
  <div class="search">
    <select v-model="witchSearch" @change="changeSearch">
      <option v-for="(item, index) in arrSearch.arr" :key="index" :value="item.id">
        {{ item.title }}
      </option>
    </select>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";

export default {
  name: "MsgSearch",
  components: {},
  emits: ["whichSearch"],
  setup(props, context) {
    const arrSearch = reactive({
      arr: [
        { id: "0", title: "All" },
        { id: "1", title: "Facebook" },
        { id: "2", title: "Line" },
        { id: "3", title: "Other" },
      ],
    });
    const witchSearch = ref("0");
    //開始
    onMounted(() => {});
    const changeSearch = () => {
      context.emit("whichSearch", witchSearch.value);
    };
    return {
      arrSearch,
      witchSearch,
      changeSearch,
    };
  },
};
</script>

<style scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto;
}
select {
  width: 100%;
  padding: 8px 20px;
  font-size: 18px;
  cursor: pointer;
  outline: none;
  border: 1px solid rgb(226, 226, 226);
  border-radius: 20px;
  /* change arrow */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url(../assets/img/arrow_drop_down_black_24dp.svg) 95% 50% no-repeat scroll
    transparent;
}
</style>
