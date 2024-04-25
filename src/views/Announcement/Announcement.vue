<script lang="ts" setup>
import { ref } from 'vue';
const announcementList = ref([
  {
    title: '公告1',
    content: '公告内容1',
    typetext: '通知',
    type: 'warning',
    author: 'admin',
  },
  {
    title: '公告2',
    content: '公告内容2公告内容2公告内容2',
    typetext: '消息',
    type: 'info',
    author: 'admin',
  },
  {
    title: '公告3',
    content: '公告内容3',
    typetext: '活动',
    type: 'success',
    author: 'admin',
  },
  {
    title: '公告4',
    content: '公告内容4',
    typetext: '警告',
    type: 'danger',
    author: 'admin',
  },
  {
    title: '公告5',
    content: '公告内容5',
    typetext: '通知',
    type: 'warning',
    author: 'admin',
  },
]);


</script>

<template>
  <el-card>
    <template #header>
      <div class="header">
        <h3 class="left-title">公告</h3>
        <div class="right-findmore">
          <el-button text type="primary">查看更多</el-button>
        </div>
      </div>
    </template>
    <div class="announcements">
      <ul>
        <li v-for="item in announcementList">
          <el-tag :type="item.type">{{ item.typetext }}</el-tag>
          <div class="title">{{ item.title }}</div>
          <div class="main-content">
            <div class="content">{{ item.content }}</div>
          </div>
          <div class="author">发布人：{{ item.author }}</div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<style scoped>
@import url(./Announcement.less);
</style>