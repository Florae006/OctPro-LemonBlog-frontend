<script lang="ts">
export default {
  name: '数据展示',
}
</script>
<template>
  <div v-show="this.$route.params.manage == 'manage'">
    <h1>展示manage</h1>
  </div>

  <div v-show="this.$route.params.manage == 'roleManage'">
    <h1>展示roleManage</h1>
  </div>
  
  <div v-show="this.$route.params.manage == 'tagManage'">
    <h1>展示tagManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'blogManage'">
    <h1>展示blogManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'userManage'">
    <h1>展示userManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'teachManage'">
    <h1>展示teachManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'bulletinManage'">
    <h1>展示bulletinManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'historyManage'">
    <h1>展示historyManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'cloudManage'">
    <h1>展示cloudManage</h1>
  </div>
  <div v-show="this.$route.params.manage == 'about'">
    <h1>展示about</h1>
  </div>
</template>