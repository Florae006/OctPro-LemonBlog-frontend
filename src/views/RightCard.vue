<script lang="ts" setup>
import QuickOptions from "./QuickOptions/QuickOptions.vue";
import Announcement from "./Announcement/Announcement.vue";
</script>


<template>
  <div class="shell">
    <ul>
      <li>
        <QuickOptions />
      </li>
      <li>
        <Announcement />
      </li>
    </ul>


  </div>
</template>
<style scoped>
.shell {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li {
  margin-bottom: 15px;
}
</style>