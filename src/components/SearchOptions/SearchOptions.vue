<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';
const True = ref(true);

interface Tab {
  label: string;
  name: string;
  subList: Tab[];
}

const searchTabList = defineModel({
  required: true,
  type: Array as () => Tab[],
});

const searchKeywords = defineEmits(['search-click']);

const activeName = ref('');
activeName.value = 'all';

const checkedTag = ref('');

const handleTabChange = () => {
  checkedTag.value = '';
}

const handleCheckedChange = (value: string) => {
  checkedTag.value = value;
  // 每次点击都触发搜索
  searchKeywords('search-click', checkedTag.value);
  
  // console.log('checkedTag', checkedTag.value);
}

</script>
<template>
  <div class="options">
    <el-card class="demo-card">
      <el-tabs v-model="activeName" :tab-change="handleTabChange()">
        <el-tab-pane v-for="item in searchTabList" :label="item.label" :name="item.name" class="tab-pane-init">
          <el-radio-group v-model="checkedTag" class="checkbox-group" @change="handleCheckedChange">
            <el-radio v-for="subItem in item.subList" :value="subItem.label" size="large" :border="True">
              {{ subItem.label }}
            </el-radio>
          </el-radio-group>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  height: 100%;
  padding: 0;
}

.demo-card{
  width: 100%;
  margin-top: 20px;
}
.checkAll-btn{
  width: fit-content;
  margin-bottom: 10px;
}
.checkbox-group{
  text-align: left;
}

.tab-pane-init{
  display: flex;
  flex-direction: column;
}

</style>