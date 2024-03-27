<script>
export default {
  name: 'timeDiaplay',
  data() {
    return {
      date: new Date()
    }
  },
  mounted() {
    // 用一个变量_this指向Vue实例this，保证作用域一致
    let _this = this;
    // 一个定时器(默认就是1s一变)
    this.timer = setInterval(function () {
      _this.date = new Date()
    })
  },
  methods: {
    toTitleDate(d) {
      return d.toString()
    },
    formateDate(d) {
      let year = d.getFullYear();
      let month = d.getMonth() + 1;   // getMonth()从0开始所以给它+1
      let date = d.getDate();
      let hours = d.getHours();
      let minutes = d.getMinutes();
      let seconds = d.getSeconds();
      return year + '年' + month + '月' + date + '日' + hours + '时' + minutes + '分' + seconds + '秒';
    },
  },
  beforeDestory() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<template>
  <span id="app">
    <span :title="toTitleDate(date)">{{ formateDate(date) }}</span>
  </span>
</template>
<style>
#app {
  font-size: 12px;
}
</style>