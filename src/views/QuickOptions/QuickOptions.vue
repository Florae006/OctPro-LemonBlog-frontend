<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const svgWH = ref("35px");
const svgColor = ref("#409EFF");

const quickOptions = ref([
  {
    icon: "upload",
    text: "添加题目",
    path: "/create/content",
  },
  {
    icon: "announcement",
    text: "发布公告",
    path: "/create/announcement",
  },
  {
    icon: "feedback",
    text: "问题反馈",
    path: "/dashboard/feedback",
  },
  {
    icon: "user",
    text: "用户管理",
    path: "/manage/user",
  },
  // {
  //   icon: "edit",
  //   text: "编辑题目",
  //   path: "/dashboard/content",
  // },
  {
    icon: "files",
    text: "内容管理",
    path: "/dashboard/content",
  },
  // {
  //   icon: "subadmin",
  //   text: "子管理员",
  //   path: "/dashboard/subadmin",
  // },
  // {
  //   icon: "data-analysis",
  //   text: "数据分析",
  //   path: "/dashboard/data-analysis",
  // },
  {
    icon: "setting",
    text: "系统设置",
    path: "/dashboard/setting",
  },
]);

const allLayout = ref(false);
const router = useRouter();
const toPath = (path: string) => {
  router.push(path);
};


</script>

<template>
  <el-card>
    <template #header>
      <div class="right-header-textbox">
        <h3>快捷操作</h3>
      </div>
    </template>
    <div class="options">
      <el-button class="btn-content" v-for="item in quickOptions.slice(0, allLayout ? quickOptions.length : 3)" @click="toPath(item.path)">
        <div>
          <!-- <SvgIcon :name="item.icon" :width="svgWH" :height="svgWH" :color="svgColor" /> -->
          <div>{{ item.text }}</div>
        </div>
      </el-button>
    </div>
    <template #footer>
      <div>
        <el-button @click="allLayout = !allLayout">{{ allLayout ? "收起" : "查看更多" }}</el-button>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.right-header-textbox {
  display: flex;
  justify-content: space-between;
}

.options .btn-content {
  margin: 0.5rem;
  height: fit-content;
}
</style>