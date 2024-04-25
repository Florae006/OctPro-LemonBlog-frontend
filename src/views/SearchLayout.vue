<script lang="ts" setup>
import SearchBar from '../components/SearchBar/SearchBar.vue';
import SearchOptions from '../components/SearchOptions/SearchOptions.vue';
import SearchResult from '../components/SearchResult/SearchResult.vue';
import { ref } from 'vue';

interface Tab {
  label: string;
  name: string;
  subList: Tab[];
}

const searchTabList = defineModel({
  required: true,
  type: Array as () => Tab[],
});
const searchTablist = ref(searchTabList.value);

// 接受SearchOptions组件传递的数据，并传递到SearchBar组件
const searchKeyword = ref('');
// const backSearchResult = ref({});
const handleSearchTabChange = (value: string) => {
  searchKeyword.value = value;
}

// 接受SearchBar组件传递的数据，并传递到SearchResult组件
const backSearchResult = ref({
  searchResult: [
    {
      title: '前端第一次培训',
      keywords: ['Vue', 'React', 'JavaScript'],
      content: '内容',
    },
    {
      title: '前端第二次培训',
      keywords: ['Vue', 'React', 'JavaScript'],
      content: '内容',
    },
    {
      title: '前端第三次培训',
      keywords: ['Vue', 'React', 'JavaScript'],
      content: '内容',
    },
    {
      title: '后端第一次培训',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
    {
      title: '后端第二次培训',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
    {
      title: '后端第三次培训',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
    {
      title: '算法第一次培训',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
    {
      title: '算法第二次培训',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
    {
      title: '算法第三次培训',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
    {
      title: '2021年培训总结',
      keywords: ['关键词1', '关键词2', '关键词3'],
      content: '内容',
    },
  ],
  pageSize: 10,
  page: 1,
  total: 200,
});

</script>
<template>
  <div class="shell">
    <h2>搜索</h2>
    <SearchBar v-model="searchKeyword" />
    <SearchOptions v-model="searchTablist" @search-click = "handleSearchTabChange"/>
    <SearchResult v-model="backSearchResult" />
  </div>
</template>

