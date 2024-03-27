<script lang="ts">
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: '搜索结果',
  created() {
    // console.log(this.$route.query.q);
    if (this.$route.params.searchType == 'content') {
      const options = {
        url: `https://pd54419854.imdo.co/index/search/blog`,
        method: 'GET',
        params: {
          curPage: 1,
          content: this.$route.query.q,
        }
      };
      axios(options).then((res) => {
        console.log(res.data.data);
        this.recordsList = res.data.data.records;
        this.totalItem = res.data.data.total;
        // console.log(this.recordsList)
      })
    }
    else {
      // 搜索用户
      const options = {
        url: `https://pd54419854.imdo.co/index/search/user`,
        method: 'GET',
        params: {
          curPage: 1,
          content: this.$route.query.q,
        }
      };
      axios(options).then((res) => {
        console.log(res.data.data);
        this.usersList = res.data.data.records;
        this.totalItem = res.data.data.total;
        // console.log(this.recordsList)
      })
    }

  },
  setup() {
    const recordsList = ref([] as any[]);
    const usersList = ref([] as any[]);
    const currentPage = ref(1);
    const totalItem = ref(0);
    return {
      totalItem,
      currentPage,
      recordsList,
      usersList
    }
  },
  methods: {
    toUser(uid: any) {
      this.$router.push({
        path: `/user/${uid}`,
      });
    },
    toAuther(autherid: any) {
      this.$router.push({
        path: `/user/${autherid}`,
      })
    },
    toBlog(blogid: any) {
      this.$router.push({
        path: `/post/${blogid}`,
      })
    },
    toTag(tag: any) {
      this.$router.push({
        path: `/tag/${tag}`,
      })
    },
    handleCurrentChange(val: number) {
      console.log(val);
      // 发送第val页的get请求
      if (this.$route.params.searchType == 'content') {
        const options = {
          url: `https://pd54419854.imdo.co/index/search/blog`,
          method: 'GET',
          params: {
            curPage: val,
            content: this.$route.query.q,
          }
        };
        axios(options).then((res) => {
          console.log(res.data.data);
          this.recordsList = res.data.data.records;
          this.totalItem = res.data.data.total;
          // console.log(this.recordsList)
        })
      }
      else {
        // 搜索用户
        const options = {
          url: `https://pd54419854.imdo.co/index/search/user`,
          method: 'GET',
          params: {
            curPage: val,
            content: this.$route.query.q,
          }
        };
        axios(options).then((res) => {
          console.log(res.data.data);
          this.usersList = res.data.data.records;
          this.totalItem = res.data.data.total;
          // console.log(this.recordsList)
        })
      }

    }
  }
}
</script>
<template>
  <div style="display: flex;justify-content: center;align-items: center;">
    <div style="position:fixed;top:60px;background-color: #f9fbff;width:100%;">
      <h1 style="margin-left: 220px;"><span style="color:red">{{ this.$route.query.q }}</span>搜索结果(共{{ totalItem }}条结果)：
        <el-pagination v-model:current-page="currentPage" :small="false" :disabled="false" :background="true"
          layout="prev, pager, next, jumper" :total="totalItem" @current-change="handleCurrentChange"
          style="float: right;margin-right: 360px;" />
      </h1>
    </div>
    
    <div style="width:1000px;margin-top: 50px;">
      <el-card v-if="this.$route.params.searchType == 'content'" v-for="i in recordsList" :key="i.blogId" shadow="hover"
        style="height: 220px;text-align: left;font-size: 17px;color: #6e6e6e;margin: 20px 20px;">
        <template #header>
          <div class="card-header">
            <h3 @click="toBlog(i.blogId)" style="cursor: pointer;">{{ i.title }}</h3>
            <el-tag v-for="tag in i.blogLabels" @click="toTag(tag)" style="cursor: pointer;">{{ tag }}</el-tag>
          </div>
        </template>
        <div @click="toAuther(i.autherId)">
          <div style="font-size:20px;line-height: 1.2;float:right;cursor: pointer;vertical-align: middle;">
            <el-avatar :src="i.autherAvatar" /><span>{{ i.auther }}</span>
          </div>
        </div>
        <span @click="toBlog(i.blogId)" style="cursor: pointer;">{{ i.blogBrief }}</span>
      </el-card>

      <el-card v-else v-for="i in usersList" style="margin: 20px 20px;">
        <el-avatar :size="80" :src="i.avatar" style="float: left;margin:10px ;cursor: pointer;"
          @click="toUser(i.userId)" />
        <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;" @click="toUser(i.userId)">
          <span>{{ i.nickname }}</span>
          <div style="font-size: 15px;">{{ i.intro }}</div>
        </div>
      </el-card>

    </div>
  </div>
</template>