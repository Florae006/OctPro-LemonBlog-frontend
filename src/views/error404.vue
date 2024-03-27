<template>
  <div style="position:absolute;width:fit-content;height:fit-content;left:0; right:0; top:0; bottom:0;margin:auto;">
    <div>
      <div style="font-size: 600px;display:inline;position:fixed;bottom:30px;left:100px;">🌑</div>
      <div style="font-size: 400px;display:inline;position:fixed;bottom:30px;">🌙</div>
      <div style="font-size: 100px;display:inline;position:fixed;top:30px;">⭐</div>
      <div style="font-size: 200px;display:inline;position:fixed;top:300px;left:20px;">⭐</div>
      <div style="font-size: 100px;display:inline;position:fixed;bottom:30px;">⭐</div>
      <div style="font-size: 250px;display:inline;position:fixed;bottom:400px;left:1300px;">4️⃣</div>
      <div style="font-size: 250px;display:inline;position:fixed;bottom:400px;left:1000px;">0️⃣</div>
      <div style="font-size: 250px;display:inline;position:fixed;bottom:400px;left:700px;">4️⃣</div>
      
      <div style="position:absolute;top:100px;font-size: 50px;font-weight: 1000;width:800px;">{{ message }}</div>
      <div style="position:absolute;top:160px;font-size: 50px;font-weight: 1000;width:800px;">您可以点击下面按钮返回🤔</div>
      <el-button type="success" round @click="handleBack" style="position:absolute;top:250px;font-size: 30px;font-weight: 400;height:fit-content;width:fit-content;line-height: 2;padding:0 20px"><el-icon><DArrowLeft /></el-icon>返回</el-button>

    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  name: "Page404",
  computed: {
    message() {
      return "没有找到你要访问的页面。。。🥲";
    },
  },

  methods: {
    handleBack() {
      this.$router.go(-2);
    },
  },
};
</script>
