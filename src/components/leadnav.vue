<script lang="ts">

import axios from 'axios';
import {
  Edit,
  Search,
} from '@element-plus/icons-vue'

import { h, reactive, ref } from 'vue'
import timeDisplay from './cmpnts/timeDisplay.vue';
import { id } from 'element-plus/es/locale';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';

export default {
  name: 'Leadnav',
  created() {
    if (this.authStr.isloged) {
      // 登录状态
      if (typeof (EventSource) !== 'undefined') {
        const evtSource = new EventSource(`https://pd54419854.imdo.co/message/subscribe/${this.authStr.userId}`, { withCredentials: true })
        evtSource.onopen = function (e) {
          console.log(e);
        }

        // 当从事件源接收到数据时触发
        evtSource.onmessage = function (e) {
          console.log(e);
          ElNotification({
            title: '提示',
            message: h('i', { style: 'color: red' }, e.data),
          })
        };

        // 与事件源的连接无法打开时触发
        evtSource.onerror = function (e) {
          console.log(e);
          evtSource.close(); // 关闭连接
        }
        // 也可以侦听命名事件，即自定义的事件
        evtSource.addEventListener('msg', function (e) {
          console.log(e.data)
        })
      } else {
        console.log('当前浏览器不支持使用EventSource接收服务器推送事件!');
      }
    }
    
  },
  setup() {
    const authStr = reactive({
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      myInfo: JSON.parse(localStorage.getItem('myInfo') || '{}'),
    });
    const searchContent = ref('');

    const activeIndex = ref('1')

    const select = ref('1')
    return {
      authStr, searchContent,
      activeIndex,
      select,
    }
  },
  methods: {
    toEditor() {
      if (this.authStr.isloged) {
        this.$router.push({
          path: `/editor/${this.authStr.userId}`,
        })
      } else {
        alert('请先登录后发布文章！');
        this.$router.push({
          path: '/logReg/login',
        })
      }
    },
    toUser() {
      this.$router.push({
        path: `/user/${this.authStr.userId}`,
      })
    },
    toUserMsg() {
      this.$router.push({
        path: `/creator/${this.authStr.userId}/settings/myMessage`,
      })
    },
    logout() {
      axios.defaults.headers.common["token"] = this.authStr.token;
      axios.defaults.headers.common["userId"] = this.authStr.userId;
      const options = {
        method: "GET",
        url: `https://pd54419854.imdo.co/user/logout/${this.authStr.userId}`,
      }
      axios(options).then((response) => {
        console.log(JSON.stringify(response.data));
        localStorage.setItem('token', '');
        localStorage.setItem('userId', '');
        localStorage.setItem('myInfo', '');
        // console.log('登出!');
        this.$router.push({
          path: `/`,
        })

        location.reload();
      }).catch((err) => {
        console.log(err);
      })
    },
    search() {
      if (this.searchContent.length < 2) {
        ElMessage.warning('搜索内容请大于1字符！')
      }
      else {
        if (this.select == '1') {
          // 按内容搜
          this.$router.push({
            path: `/search/content`,
            query: {
              q: this.searchContent,
            },
          })
        }
        else {
          // 按用户搜
          this.$router.push({
            path: `/search/user`,
            query: {
              q: this.searchContent,
            },
          })
        }

      }
    },
    adminlogin() {
      this.$router.push({
        path: '/admin',
      })
    },
  },
}
</script>


<template>
  <el-affix :offset="0">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
      <el-menu-item index="0">
        <router-link to="/"><span class="blog-icon">🍋LemonBlog</span></router-link>
      </el-menu-item>
      <timeDisplay />
      <div class="flex-grow" />

      <div class="input-box mb20">
        <el-input placeholder="请输入搜索内容(大于1字符)" style="width: 600px;" v-model="searchContent">
          <template #prepend>
            <el-select v-model="select" style="width: 100px;background-color:rgb(237, 237, 249);">
              <el-option label="搜内容" value="1" />
              <el-option label="搜作者" value="2" />
            </el-select>
          </template>
          <template #append>
            <el-button @click="search" />
          </template>
        </el-input>

      </div>

      <el-menu-item index="1" @click="toEditor">
        <el-icon :size="20">
          <Edit />
        </el-icon>
        发布文章
      </el-menu-item>
      <el-menu-item index="4" v-show="!this.authStr.isloged">
        <template #title>
          <router-link to="/admin">
            管理员登录
          </router-link>
        </template>
      </el-menu-item>
      <el-menu-item index="2" v-show="!this.authStr.isloged">
        <template #title>
          <router-link to="/logReg/login">
            登录/注册
          </router-link>
        </template>
      </el-menu-item>
      <el-sub-menu index="3" v-show="this.authStr.isloged">
        <template #title>
          个人中心
        </template>
        <el-menu-item index="3-1" @click="toUser">个人主页</el-menu-item>
        <el-menu-item index="3-2" @click="toUserMsg">我的消息</el-menu-item>
        <el-menu-item index="3-3" @click="logout">退出登录</el-menu-item>
        <el-menu-item index="3-4" @click="adminlogin">管理员登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-affix>
  <router-view />
</template>


<style>
.flex-grow {
  flex-grow: 1;
}

.el-menu-demo {
  align-items: center;
}

.blog-icon {
  font-size: 20px;
  font-weight: 900;
  padding: 6px;
}

.input-box {
  position: relative;
  display: inline-block;
}

.input {
  padding: 0 40px 0 20px;
  width: 230px;
  height: 38px;
  font-size: 14px;
  border: 1px solid #999;
  border-radius: 40px;
  background: #ebedf4;
  transition: width .5s;
  transition-delay: .1s;
}

.spanSearch {
  position: absolute;
  top: 4px;
  right: 5px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  padding: 0;
  color: rgb(255, 100, 255);
  background-color: rgb(255, 255, 255);
  text-align: center;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.input:focus {
  width: 480px;
  outline: none;
  box-shadow: none;
}

.input:focus+.spanSearch {
  background-color: rgb(227, 248, 232);
  border: #999 solid 1px;
  color: #fad6d6;
}
</style>