<script lang="ts" setup>
import { ref } from 'vue';
import Vue3Autocounter from 'vue3-autocounter';
const svgWH = ref("40px");
const svgColor = ref("#837881");

const dataList = ref([
  {
    icon: 'user',
    title: '用户总数',
    content: '100'
  },
  {
    icon: 'question-bank',
    title: '套题总数',
    content: '100'
  },
  {
    icon: 'announcement',
    title: '公告总数',
    content: '100'
  },
  {
    icon: 'feedback',
    title: '问题反馈总数',
    content: '100'
  },
  {
    icon: 'subadmin',
    title: '子管理员总数',
    content: '100'
  },
  {
    icon: 'files',
    title: '文件总数',
    content: '100'
  },
  {
    icon: 'data-analysis',
    title: '数据分析总数',
    content: '100'
  },
  {
    icon: 'setting',
    title: '系统设置总数',
    content: '100'
  },
])
</script>

<template>
  <el-card>
    <template #header>
      <h3>站内数据</h3>
    </template>
    <div class="data-overview">
      <div class="data-item" v-for="item in dataList.slice(0, 4)">
        <div class="data-item-icon">
          <!-- <SvgIcon :name="item.icon" :width="svgWH" :height="svgWH" :color="svgColor" /> -->
        </div>
        <div>
          <div class="data-item-title">{{ item.title }}</div>
          <div class="data-item-content">
            <Vue3Autocounter :startAmount="0" :endAmount="parseInt(item.content)" :duration="3"/>
          </div>
        </div>
      </div>
    </div>
    <div class="data-overview">
      <div class="data-item" v-for="item in dataList.slice(4)">
        <div class="data-item-icon">
          <SvgIcon :name="item.icon" :width="svgWH" :height="svgWH" :color="svgColor" />
        </div>
        <div>
          <div class="data-item-title">{{ item.title }}</div>
          <div class="data-item-content">
            <Vue3Autocounter :startAmount="0" :endAmount="parseInt(item.content)" :duration="3"/>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="canvas-container">
        <h3>可画数据展示【待开发】</h3>
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.data-overview {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  text-align: center;
  padding: 0 20px;
}

.data-item {
  width: 20%;
  padding: 5px 10px;
  display: flex;
  align-items: center;
}

.data-item-icon {
  margin-right: 10px;
}

.data-item-title {
  font-weight: 700;
  font-size: 12px;
}

.data-item-content {
  color: rgb(255, 99, 99);
  font-weight: 600;
  font-size: 26px;
}
</style>