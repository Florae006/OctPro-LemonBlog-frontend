<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const searchInput = ref('');
// const svgWH = ref("20px");
// const svgColor = ref('#999');

const searchKeyWord=defineModel({
  required: true,
  type: String,
});

const router = useRouter();

const search = () => {
  if (searchInput.value === ''&&searchKeyWord.value==='') {
    ElMessage({
      message: '请输入搜索关键词或选择搜索类型！',
      type: 'warning'
    });
    return;
  }
  const searchInputValue= searchInput.value.replace(' ','+');
  const query = {
    page: 1,
    pageSize: 10,
    search: searchInputValue,
    keyword: searchKeyWord.value,
  };
  router.push({
    path: '/dashboard/content',
    query: query
  });
};

</script>

<template>
  <div class="search-box">
    <div class="input-line">
      <el-input v-model="searchInput" type="text" class="search-input" placeholder="输入关键词搜索">
        <template #prefix>
          <!-- <SvgIcon name="search" :width="svgWH" :height="svgWH" :color="svgColor"></SvgIcon> -->
        </template>
      </el-input>
      <el-button type="primary" class="search-btn" @click="search">搜索</el-button>
    </div>
  </div>
</template>
<style scoped>
.search-box {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.input-line {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: fit-content;
}

.search-input,
.search-btn {
  font-size: 18px;
  margin: 0;
}

.search-input {
  flex: 1;
  height: 40px;
}

.search-btn {
  width: 10%;
  height: 40px;
}
</style>