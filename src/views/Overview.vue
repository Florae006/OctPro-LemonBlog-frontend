<script setup lang="ts">

</script>

<template>
  <div class="shell">
    <div class="left-box">
      <slot name="left"></slot>
    </div>
    <div class="right-box">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
}

.left-box{
  flex: 1;  /* 1:1撑开剩余部分 */
  height: 100%;
  margin-right: 15px;
}
.right-box{
  width: 25%;
  height: 100%;
}
</style>