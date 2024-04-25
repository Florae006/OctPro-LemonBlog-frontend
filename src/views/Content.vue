<script lang="ts" setup>
import Bread from "./Bread.vue";
import SearchLayout from "./SearchLayout.vue";
import { ref } from 'vue';

const byTagList = ref([
  {
    label: '前端培训课',
    name: 'tag1',
    subList: [],
  },
  {
    label: '后端培训课',
    name: 'tag2',
    subList: [],
  },
  {
    label: '算法课程',
    name: 'tag3',
    subList: [],
  },
]);

const byYearList = ref([
  {
    label: '2021',
    name: '2021',
    subList: [],
  },
  {
    label: '2020',
    name: '2020',
    subList: [],
  },
  {
    label: '2019',
    name: '2019',
    subList: [],
  },
  {
    label: '2018',
    name: '2018',
    subList: [],
  }
]);
const byAllList = ref([...byTagList.value, ...byYearList.value]);
const searchTablist = ref([
  {
    label: '全部',
    name: 'all',
    subList: byAllList,
  },
  {
    label: '按标签',
    name: 'byTag',
    subList: byTagList,
  },
  {
    label: '按年份',
    name: 'byYear',
    subList: byYearList,
  },
]);

</script>
<template>
  <Bread>
    内容管理
  </Bread>

  <div class="shell">
    <SearchLayout v-model="searchTablist" />
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  height: 100%;
  padding: 0;
}
</style>