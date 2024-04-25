<script lang="ts" setup>
import Overview from "./Overview.vue";
import RightCard from "./RightCard.vue";
import LeftCard from "./LeftCard.vue";
import Bread from "./Bread.vue";


</script>

<template>
  <Bread>
    概览
  </Bread>

  <div class="shell">
    <Overview>
      <template #left>
        <LeftCard/>
      </template>
      <template #right>
        <RightCard/>
      </template>
    </Overview>
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  height: 100%;
  padding: 0;
}
</style>