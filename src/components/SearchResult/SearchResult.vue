<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const empty = ref(false);
const backSearchResult = defineModel({
  required: true,
  type: Object as () => {
    searchResult: Array<{
      title: string;
      keywords: string[];
      content: string;
    }>;
    pageSize: number;
    page: number;
    total: number;
  },
});

empty.value = (backSearchResult.value.searchResult.length === 0);

const searchResult = ref(backSearchResult.value.searchResult);

const currentPageChange = (val: number) => {
  console.log(val);
}

const toPost = () => {
  router.push('/post/0');
}
</script>

<template>
  <div class="search-result">
    <div v-if="empty">
      <el-empty description="暂无数据" />
    </div>
    <div v-else class="search-result__list">
      <div v-for="item in searchResult" class="search-result__item" shadow="never" :onclick="toPost">
        <div class="title">
          <h2>{{ item.title }}</h2>
          <div class="keywords">
            <el-tag v-for="keyword in item.keywords">{{ keyword }}</el-tag>
          </div>
        </div>
        <div class="content">
          {{ item.content }}
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" 
      :total="backSearchResult.total" 
      :default-page-size="backSearchResult.pageSize" 
      :hide-on-single-page="backSearchResult.total <= backSearchResult.pageSize"
      @current-change="currentPageChange" />
    </div>
  </div>
</template>
<style scoped>
@import './SearchResult.less';
</style>