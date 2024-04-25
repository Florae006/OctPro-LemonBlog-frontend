<script lang="ts" >
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import Content from './Content.vue';
import Welcome from './Welcome.vue';

export default {
  components: {
    Content,Welcome,
  },

  setup() {
    const blogList = ref([] as any[]);
    const accuseUserList = ref([] as any[]);
    const blogAccuseList = ref({
      records: ref([] as any[]),
    });
    const commentAccuseList = ref({
      records: ref([] as any[]),
    });
    const tagName = ref('');
    const labelsList = ref([] as any[]);

    return {
      tagName, labelsList,
      blogList, accuseUserList, blogAccuseList, commentAccuseList,
    }
  },

  methods: {
    showView(rter: any, name: string) {
      this.$router.push({
        path: `/admin/${rter}`,
      })
      if (rter == 'blogManage') {
        this.blogManage();
      }
      else if (rter == 'accuseManage') {
        this.accuseManage();
      }
      else if (rter == 'tagManage') {
        this.tagManage();
      }
      else if (rter == 'teachManage') {
        this.teachManage();
      }
    },
    teachManage() {
      // TODO: 培训管理
    },
    tagManage() {
      const option = {
        url: `https://pd54419854.imdo.co/column/label`,
        method: 'GET',
      }
      axios(option).then((res) => {
        if (res.data.code == 0) {
          this.labelsList = res.data.data;
        } else {
          ElMessage.error(res.data.msg);
        }
      })
    },
    accuseManage() {
      // 获得列表
      axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
      // 获得博客列表
      const options = {
        method: "GET",
        url: `https://pd54419854.imdo.co/admin/examine/accuse`,
        params: {
          curPage: 1,
          type: 0,
        }
      };
      // console.log(options);
      axios(options).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.blogAccuseList = res.data.data;
        } else {
          ElMessage.error(res.data.msg);
        }
      });

      // 获得被举报评论
      const option = {
        method: "GET",
        url: `https://pd54419854.imdo.co/admin/examine/accuse`,
        params: {
          curPage: 1,
          type: 1,
        }
      };
      // console.log(option);
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.commentAccuseList = res.data.data;
        } else {
          ElMessage.error(res.data.msg);
        }
      })
    },
    blogManage() {
      // 博客审查
      axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
      const options = {
        method: "GET",
        url: `https://pd54419854.imdo.co/admin/examine/blog`,
      };
      // console.log(options);
      axios(options).then((res) => {
        if (res.data.code == 0) {
          // 获得博客列表
          this.blogList = res.data.data;
        } else {
          ElMessage.error(res.data.msg);
        }
      })
    },
    passBlog(type: number, blogId: number) {
      ElMessageBox.confirm(`确认${type == 0 ? '驳回' : '通过'}吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const options = {
          url: `https://pd54419854.imdo.co/admin/examine/blog/${blogId}`,
          method: 'PUT',
          params: {
            result: type,
          }
        };
        console.log(options);
        axios(options).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success('操作成功！');
          } else {
            ElMessage.error(res.data.msg);
          }
        })

      })
        .catch(() => {
          // 取消
        })
    },
    backAccuse(accuseId: number) {
      // 驳回举报
      ElMessageBox.confirm(`确认驳回吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const options = {
          url: `https://pd54419854.imdo.co/admin/examine/accuse/${accuseId}/reject`,
          method: 'POST',
        }
        console.log(options);
        axios(options).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success('操作成功！');
          } else {
            ElMessage.error(res.data.msg);
          }
        })

      })
        .catch(() => {
          // 取消
        })
    },
    removeBlogOrComment(type: number, objectId: number) {
      ElMessageBox.confirm(`确认${type == 0 ? '下架博客' : '删除评论'}吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const options = {
          url: `https://pd54419854.imdo.co/admin/examine/content/delist`,
          method: 'POST',
          data: {
            type: type,
            objectId: objectId,
          }
        }
        console.log(options);
        axios(options).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success('操作成功！');
          } else {
            ElMessage.error(res.data.msg);
          }
        })
      })
        .catch(() => {
          // 取消
        })
    },
    delComment(commentId: number) {
      ElMessageBox.confirm(`确认删除评论吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const options = {
          url: `https://pd54419854.imdo.co/admin/examine/comment/${commentId}`,
          method: 'POST',
        }
        console.log(options);
        axios(options).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success('操作成功！');
          } else {
            ElMessage.error(res.data.msg);
          }
        })
      })
        .catch(() => {
          // 取消
        })
    },
    submitNewLabel() {
      if (this.tagName == '') {
        ElMessage.warning('新标签不可为空！');
        return;
      }
      ElMessageBox.confirm(`确认设置新标签${this.tagName}吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const option = {
          url: `https://pd54419854.imdo.co/admin/column/label/add`,
          method: 'POST',
          data: {
            label: this.tagName,
          }
        };
        axios(option).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success(`新标签${this.tagName}设置成功!`);
            this.tagName = '';
          } else {
            ElMessage.error(res.data.msg);
          }
        })
      }).catch(() => {
        // 取消
      })

    },
    adminLogout() {
      ElMessageBox.confirm(`确认登出吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const option = {
          url: `https://pd54419854.imdo.co/admin/logout`,
          method: 'POST',
        };
        axios(option).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success(`登出成功!`);
            this.$router.push({
              path: '/admin',
            });
            localStorage.setItem('adminToken', '');
          } else {
            ElMessage.error(res.data.msg);
          }
        })
      }).catch(() => {
        // 取消
      })

    },
    delLabel(label: string) {
      ElMessageBox.confirm(`确认删除标签${label}吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        axios.defaults.headers.common["token"] = localStorage.getItem('adminToken');
        const option = {
          url: `https://pd54419854.imdo.co/admin/column/label/remove`,
          method: 'POST',
          data: {
            label: label,
          }
        };
        axios(option).then((res) => {
          if (res.data.code == 0) {
            ElMessage.success(`删除成功!`);
            this.tagManage();
          } else {
            ElMessage.error(res.data.msg);
          }
        })
      }).catch(() => {
        // 取消
      })
    }
  }
}

</script>
<template>
  <div style="padding: 0;margin:0;height:90%">
    <el-container style="height: 100%;direction:vertical;background-color: rgb(208, 238, 255);">
      <el-aside
        style="width: 200px;background-color: #ffffff;color:rgb(72, 72, 72);font-size: 20px;text-align: center;box-sizing:content-box;border:2px solid #ffffff">
        <el-menu style="background-color: transparent;">
          <h1 style="text-align: center;width:100%;">菜单</h1>
          <el-menu-item index="0" @click="showView('manage', '仪表盘')">
            <el-icon>
              <Aim />
            </el-icon><span>仪表盘</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Avatar />
              </el-icon>
              <span>超级管理员</span>
            </template>
            <el-menu-item index="1-1" @click="showView('roleManage', '角色管理')"><el-icon>
                <UserFilled />
              </el-icon>角色管理</el-menu-item>
            <el-menu-item index="1-2" @click="showView('tagManage', '标签管理')"><el-icon>
                <CollectionTag />
              </el-icon>标签管理</el-menu-item>
            <el-menu-item index="1-3" @click="showView('blogManage', '博客管理')"><el-icon>
                <Document />
              </el-icon>博客管理</el-menu-item>
            <el-menu-item index="1-4" @click="showView('accuseManage', '举报管理')"><el-icon>
                <Coin />
              </el-icon>举报管理</el-menu-item>
              <el-menu-item index="1-5" @click="showView('teachManage', '培训管理')"><el-icon>
                <Bell />
              </el-icon>培训管理
              </el-menu-item>
            <el-menu-item index="1-6" @click="showView('bulletinManage', '公告管理')"><el-icon>
                <Bell />
              </el-icon>公告管理</el-menu-item>
            <el-menu-item index="1-7" @click="showView('historyManage', '操作历史')"><el-icon>
                <PieChart />
              </el-icon>操作历史</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2" @click="showView('cloudManage', '服务器状态')"><el-icon>
              <Cloudy />
            </el-icon>服务器状态</el-menu-item>
          <el-menu-item index="3" @click="showView('about', '关于我们')"><el-icon>
              <InfoFilled />
            </el-icon>关于我们</el-menu-item>
          <el-menu-item index="4" @click="adminLogout"><el-icon>
              <SwitchButton />
            </el-icon>退出登录</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color: rgb(219, 244, 255);">
        <div v-if="this.$route.params.manage == 'welcome'">
          <h1>欢迎您，管理员</h1>
          <Welcome/>
        </div>

        <div v-if="this.$route.params.manage == 'tagManage'">
          <h1>标签列表</h1>
          <el-input style="width: 300px;height:40px;" v-model="tagName" placeholder="请设置新标签" />
          <el-button @click="submitNewLabel" style="height: 37px;" type="primary">提交新标签</el-button>

          <el-row v-for="(i, index) in labelsList" :span="24" style="overflow: auto;margin:0 20px;padding:10px 0;">
            <el-col :key="index">
              <el-card>
                <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;">
                #{{ i }}
                </div>

                <el-button @click="delLabel(i)" color="red" style="float: right;margin:0 10px;">删除标签</el-button>

              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-if="this.$route.params.manage == 'accuseManage'">
          <div style="float:left;width: 50%;">
            <h1>被举报博客列表</h1>
            <el-row v-for="(i, index) in blogAccuseList.records" :span="24"
              style="overflow: auto;margin:0 20px;padding:10px 0;">
              <el-col :key="index">
                <el-card>
                  <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;">
                    <div>举报内容：{{ i.content }}</div>
                    <span style="font-size: 15px;">举报类型：{{ i.brief }}</span>
                  </div>

                  <el-button @click="backAccuse(i.id)" style="float: right;margin-left: 10px;">驳回</el-button>
                  <el-button @click="removeBlogOrComment(0, i.objectId)" color="#626aef"
                    style="float: right;">下架博客</el-button>

                </el-card>
              </el-col>
            </el-row>
          </div>
          <div style="float:left;width: 50%;">
            <h1>被举报评论列表</h1>
            <el-row v-for="(i, index) in commentAccuseList.records" :span="24"
              style="overflow: auto;margin:0 20px;padding:10px 0;">
              <el-col :key="index">
                <el-card>
                  <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;">
                    <div>举报内容：{{ i.content }}</div>
                    <span style="font-size: 15px;">举报类型：{{ i.brief }}</span>
                  </div>

                  <el-button @click="backAccuse(i.id)" style="float: right;margin-left: 10px;">驳回</el-button>
                  <el-button @click="delComment(i.objectId)" color="red" style="float: right;">删除评论</el-button>

                </el-card>
              </el-col>
            </el-row>
          </div>


        </div>
        <div v-if="this.$route.params.manage == 'blogManage'">
          <el-card v-for="i in blogList" :key="i.blogId" class="infinite-list-item" shadow="hover"
            style="height: 180px;text-align: left;font-size: 17px;color: #3a3a3a;margin:18px;">
            <template #header>
              <div style="height: 40px;">
                <h3>
                  <span style="cursor: pointer;">{{ i.title }}</span>
                  <span style="float:right;font-size: 15px;color:green;cursor:pointer;"><el-button
                      @click="passBlog(1, i.blogId)" type="primary" style="margin:0 20px;">通过</el-button><el-button
                      @click="passBlog(0, i.blogId)">驳回</el-button></span>
                </h3>
                <el-tag v-for="tag in i.blogLabels" style="cursor: pointer;">{{ tag }}</el-tag>
              </div>
            </template>
            <div>
              <div style="font-size:20px;line-height: 1.2;float:right;cursor: pointer;vertical-align: middle;">
                <el-avatar :src="i.autherAvatar" /><span>{{ i.auther }}</span>
              </div>
            </div>
            <span>{{ i.blogBrief }}</span>
          </el-card>
        </div>

        <div v-if="this.$route.params.manage == 'teachManage'">
        <Content/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<style>
#app,
html,
body {
  height: 100%;
}
</style>