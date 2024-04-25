<script lang="ts" setup>
</script>
<template>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot></slot>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<style scope>
.bread{
  margin: 1.5vh 0;
  padding:0 0.5vw;
  width: 100%;
}
</style>