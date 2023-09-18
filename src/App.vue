<template>
  <div class="test-div">
    <Transfer
      v-model:right="transferRightList"
      v-model:left="transferLeftList"
      v-loading="isLoading"
    >
    </Transfer>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Transfer from "./components/index.vue";

const transferRightList: any = ref([]);
const transferLeftList: any = ref([]);

const isLoading = ref(true);

const getAllList = () => {
  setTimeout(() => {
    const data: any = [];
    for (let i = 1; i <= 2000; i++) {
      data.push({
        id: i,
        name: `Option ${i}`,
        subInfo: `Option ${i},name:Option ${i}`,
        disabled: i % 4 === 0,
      });
    }
    transferLeftList.value = data;
    isLoading.value = false;
  }, 2000);
};
getAllList();
</script>
<style>
.test-div {
  width: 780px;
  margin: 0 auto;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
