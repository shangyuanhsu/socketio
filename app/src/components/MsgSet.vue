<template>
  <div class="msgSet">
    <div
      v-for="(item, index) in arrProcess.arr"
      :key="index"
      :class="[item.checked ? 'checked' : '']"
      @click="changeChecked(index)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";

export default {
  name: "MsgSet",
  components: {},
  emits: ["whichProcess"],

  setup(props, context) {
    const arrProcess = reactive({
      arr: [
        { id: 0, title: "Processed", checked: true },
        { id: 1, title: "Processing", checked: false },
        { id: 2, title: "Completed", checked: false },
      ],
    });

    //開始
    onMounted(() => {});

    const changeChecked = (index) => {
      arrProcess.arr = arrProcess.arr.map((item, ind) => {
        return {
          ...item,
          checked: index === ind ? true : false,
        };
      });
      const p = arrProcess.arr.filter((item) => item.checked);
      context.emit("whichProcess", p[0].id);
    };
    return {
      arrProcess,
      changeChecked,
    };
  },
};
</script>

<style scoped>
.msgSet {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 2px solid rgb(228, 228, 228);
  border-radius: 20px;
  overflow: hidden;
  margin: 20px auto;
}
.msgSet div {
  text-align: center;
  padding: 10px 8px;
  font-size: 14px;
  cursor: pointer;
}
.msgSet div:not(:first-child) {
  border-left: 1px solid rgb(228, 228, 228);
}
.msgSet .checked {
  background: rgb(228, 228, 228);
}
</style>
