<script lang="ts">
import { ref } from 'vue'
import {
  Sugar,
  TrophyBase,
  Edit,
  Message,
  Filter,
  Star,
} from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'bodyMain',
  created() {
    const option = {
      url: `https://pd54419854.imdo.co/column/label`,
      method: 'GET',
    }
    axios(option).then((res) => {
      if (res.data.code == 0) {
        this.labelSimples = res.data.data;
      } else {
        ElMessage.error(res.data.msg);
      }
    })
  },
  setup() {
    const authStr = {
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      myInfo: JSON.parse(localStorage.getItem('myInfo') || '{}'),
    };
    const userform = {
      id: authStr.myInfo.id,
      rawemail: authStr.myInfo.email,
      email: '',
      qq: authStr.myInfo.qq,
      iconUrl: localStorage.getItem('userIcon'),

      nickname: authStr.myInfo.nickname,
      sex: authStr.myInfo.sex,
      birthday: authStr.myInfo.birthday,
      intro: authStr.myInfo.intro,
      profession: authStr.myInfo.profession,
      label: authStr.myInfo.label,
    };
    const labelSimples = ref([] as any[]);
    return {
      isCollapse: true,
      authStr, userform, labelSimples,
      samples: [
        {
          name: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          objectId: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
      ],
    }
  },
  methods: {
    getTopicBlog() {
      const option = {
        url: `https://pd54419854.imdo.co/index/column`,
        method: 'GET',
        params: {
          type: 'time',
          curPage: 1,
          label: this.$route.params.tag,
        }
      };
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          //
          this.samples = res.data.data.column;
        } else {
          ElMessage.error(res.data.msg);
        }
      })
    },
    login() {
      this.$router.push({
        path: '/logReg/login',
      })
    },
    toUser() {
      this.$router.push({
        path: `/user/${this.authStr.userId}`,
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
        path: `/topic/${tag}`,
      });
      this.getTopicBlog();
    },
    toFollowing() {
      this.$router.push({
        path: `/creator/${this.authStr.userId}/settings/myfollowings`,
      })
    },
    toFollowers() {
      this.$router.push({
        path: `/creator/${this.authStr.userId}/settings/myfollowers`,
      })
    },
    clickMenuList() {
      this.isCollapse = !this.isCollapse;
    }
  }
}
</script>

<template>
  <el-container>
    <el-affix :offset="20" style="margin-top: 70px;margin-left: 20px;">

      <el-menu :unique-opened="true">
        <el-menu-item style="width:100%;background-color: #6e6e6e;color:white;">
          <h1 style="text-align: center;">菜单</h1>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Filter />
            </el-icon>
            <span>内容分类</span>
          </template>

          <el-sub-menu index="1-3" v-show="this.authStr.isloged">
            <template #title>
              <el-icon>
                <Sugar />
              </el-icon>
              <span>关注</span>
            </template>
            <el-menu-item v-for="(item, subindex) in this.userform.label" :index="'' + subindex" @click="toTag(item)">
              {{ item }}
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="1-4">
            <template #title>
              <el-icon>
                <Grape />
              </el-icon>综合
            </template>
            <el-menu-item v-for="(item, subindex) in labelSimples" :index="'1-4-' + subindex" @click="toTag(item)">{{
              item }}</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon>
            <TrophyBase />
          </el-icon><span>阅读</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <TrophyBase />
          </el-icon><span>热度榜</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <Star />
          </el-icon><span>我的收藏</span>
        </el-menu-item>
      </el-menu>
    </el-affix>

    <el-main>


      <h1 v-show="this.$route.params.tag" style="font-size: 26px;">这是 {{ this.$route.params.tag }} 分类专栏里的博客</h1>
      <div style="overflow: auto">
        <div v-if="samples.length == 0">该分类下暂时没有博客哦</div>
        <el-card v-else v-for="i in samples" shadow="hover"
          style="height: 120px;text-align: left;font-size: 17px;color: #6e6e6e;margin: 20px 20px;">

          <span @click="toBlog(i.objectId)" style="cursor: pointer;">
            <h3 @click="toBlog(i.objectId)" style="cursor: pointer;">{{ i.name }}</h3>
          </span>
        </el-card>
      </div>
    </el-main>

    <el-affix :offset="20">

      <div>
        <el-card style="margin-top: 40px;align-items: center;text-align: center;margin-right: 50px;"
          v-if="this.authStr.isloged">
          <el-avatar :src="userform.iconUrl" @click="toUser" />
          <div style="padding: 14px" @click="toUser">
            <span>{{ userform.nickname }}</span>
            <div style="justify-content: space-between;text-align: center;">
              {{ userform.intro ? userform.intro : "这个人很懒，暂时没有简介哦。" }}
            </div>
          </div>
          <div>
            <el-tag v-for="item in this.userform.label" @click="toTag(item)">{{ item }}</el-tag>
          </div>

          <el-button text class="button" @click="toFollowing">关注</el-button>
          <el-button text class="button" @click="toFollowers">粉丝</el-button>
        </el-card>

        <el-card v-else="!this.authStr.isloged" style="width:300px;padding:20px;text-align: center;">
          <div style="line-height: 4;font-size: 20px;font-weight: 30px;">请先登录！</div>
          <el-button type="primary" @click="login">立即登录</el-button>
        </el-card>

      </div>
    </el-affix>

  </el-container>
</template>
