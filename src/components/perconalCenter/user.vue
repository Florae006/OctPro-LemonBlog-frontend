<script lang="ts">
import { markRaw, reactive, ref } from 'vue'
import axios from 'axios';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';

export default {
  name: 'user',

  data() {
    const tabName = ref('first')
    const isOwner = (localStorage.getItem('userId') == this.$route.params.uid);
    const authStr = {
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      myInfo: JSON.parse(localStorage.getItem('myInfo') || '{}'),
    };

    const userform = {
      id: '',
      email: '',
      qq: '',
      iconUrl: '',

      nickname: '',
      sex: '男',
      birthday: '2000-1-1',
      intro: '这个人很懒，什么都没有写。',
      profession: '暂无',
      label: [],
    };

    const collectionForm = {
      name: '',
    }
    const columnForm = {
      name: '',
    }
    const dialogBuildCollectionVisible = ref(false);
    const dialogBuildColumnVisible = ref(false);
    const columnDrawer = ref(false);

    return {
      columnDrawer,
      collectionForm, dialogBuildCollectionVisible,
      columnForm, dialogBuildColumnVisible,

      tabName,
      authStr,
      userform,
      isOwner,
      samples: [
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        }
      ],
    }
  },
  created() {
    if (this.isOwner) {
      // 是本人的个人中心，直接从localStorage获得信息
      this.userform = {
        id: this.authStr.myInfo.id,
        email: this.authStr.myInfo.email,
        qq: this.authStr.myInfo.qq,
        iconUrl: localStorage.getItem('userIcon'),

        nickname: this.authStr.myInfo.nickname,
        sex: this.authStr.myInfo.sex ? this.authStr.myInfo.sex : '男',
        birthday: this.authStr.myInfo.birthday ? this.authStr.myInfo.birthday : '2000-1-1',
        intro: this.authStr.myInfo.intro ? this.authStr.myInfo.intro : '这个人很懒，什么都没有写。',
        profession: this.authStr.myInfo.profession ? this.authStr.myInfo.profession : '暂无',
        label: this.authStr.myInfo.label ? this.authStr.myInfo.label : [],
      };
    }
    else {
      // 发送获得用户信息
      const optioni = {
        method: 'GET',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        params: {
          userId: this.$route.params.uid,
        },
        url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}`,
      };
      axios(optioni).then((response) => {
        // console.log(response.data.data);
        if (response.data.code != 0) {
          this.$router.push({
            path: `/error`,
          });
        }
        else {
          const userdata = response.data.data;

          this.userform = {
            id: userdata.id,
            email: userdata.email,
            qq: userdata.qq,

            nickname: userdata.nickname,
            sex: userdata.sex ? userdata.sex : '男',
            birthday: userdata.birthday ? userdata.birthday : '2000-1-1',
            intro: userdata.intro ? userdata.intro : '这个人很懒，什么都没有写。',
            profession: userdata.profession ? userdata.profession : '暂无',
            label: userdata.label ? userdata.label : [],
          };
          const optionUrl = {
            method: 'GET',
            headers: { 'content-type': 'application/json; charset=utf-8' },
            url: `https://pd54419854.imdo.co/userinfo/avatar/${this.$route.params.uid}`,
          };
          axios(optionUrl).then((responsex) => {
            // userIcon = response.data.data;
            this.userform.iconUrl = responsex.data.data;
          });
          console.log(this.userform);
        }

      });
    }
  },
  setup() {
    const createFilter = (queryString: any) => {
      return (item: any) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    }
    const querySearch = (queryString: any, callback: any) => {
      const emailList = [
        { value: '@qq.com' },
        { value: '@126.com' },
        { value: '@163.com' },
        { value: '@sina.com' },
        { value: '@21cn.com' },
        { value: '@sohu.com' },
        { value: '@yahoo.com.cn' },
        { value: '@tom.com' },
        { value: '@etang.com' },
        { value: '@eyou.com' },
        { value: '@56.com' },
        { value: '@x.cn' },
        { value: '@chinaren.comsogou.com' },
        { value: '@citiz.com' },
      ]
      let results: any = []
      let queryList: any = []
      emailList.map(item => {
        queryList.push({ value: queryString.split('@')[0] + item.value })
      })
      results = queryString ? queryList.filter(createFilter(queryString)) : queryList;
      callback(results);
    }
    const myArticalList = ref([] as any[]);
    const myCollectionList = ref([] as any[]);
    const myColumnList = ref([] as any[]);
    const currentPageArtical = ref(1);
    const totalItemArtical = ref(0);
    const currentPageColumn = ref(1);
    const totalItemColumn = ref(0);
    const articalId = ref(0);
    return {
      articalId,
      currentPageArtical, totalItemArtical,
      currentPageColumn, totalItemColumn,
      createFilter,
      querySearch,
      myArticalList, myCollectionList, myColumnList,
    }
  },
  methods: {
    handleClick(tab: any, event: any) {
      // console.log(tab, event);
      //这样才能获取每个el-tab-pane的name属性
      const tname = tab.props.name;
      if (tname == 'first') {
        this.getMyUps();
      }
      else if (tname == 'second') {
        this.getMyArtical(1);
      }
      else if (tname == 'third') {
        this.getMyColumns(1);
      }
      else if (tname == 'fourth') {
        this.getMyCollections();
      }
      else if (tname == 'fifth') {
        this.getMyFollowings();
      }
      else if (tname == 'sixth') {
        this.getMyLikes();
      }
    },
    getMyUps() {
      // 获取我的动态
      console.log('获取我的动态')
    },
    getMyArtical(curp: any) {
      console.log('获取我的文章列表');
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        method: 'GET',
        url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}/blog`,
        params: {
          curPage: curp
        }
      };
      axios(option).then((res) => {
        console.log(res.data);
        this.myArticalList = res.data.data.records;
        // console.log(this.myArticalList);
        this.totalItemArtical = res.data.data.total;
      })
    },
    getMyColumns(curp: any) {
      // 获取我的专栏
      console.log('获取我的专栏');
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        method: 'GET',
        url: `https://pd54419854.imdo.co/column/user/${this.$route.params.uid}`,
        params: {
          curPage: curp,
        }
      };
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.myColumnList = res.data.data.records;
          this.totalItemColumn = res.data.data.total;
          for (var i = 0; i < this.myColumnList.length; i++) {
            this.myColumnList[i].listArticalStatus = true;
            this.myColumnList[i].articalList = [];
          }
          console.log(this.myColumnList);
        } else {
          ElMessage.error(res.data.msg);
        };

      })
    },
    getMyCollections() {
      console.log('获取收藏夹列表');
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        method: 'GET',
        url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}/collections`,
      };
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.myCollectionList = res.data.data;
          for (var i = 0; i < this.myCollectionList.length; i++) {
            this.myCollectionList[i].listArticalStatus = true;
            this.myCollectionList[i].articalList = [];
          }
          console.log(this.myCollectionList);
        } else {
          ElMessage.error(res.data.msg);
        };

      })
    },
    getMyFollowings() {
      // 获取我的动态
      console.log('获取我的关注列表/包含关注的标签和用户')
    },
    getMyLikes() {
      console.log('获取我的赞过列表')
    },
    toUser() {
      this.$router.push({
        path: `/user/${this.$route.params.uid}`,
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
    updateInfo() {
      this.$refs["visiableDialog"].dialogVisble = true;
    },
    resetForm1() {
      if (!this.$refs["UpdateAccountEmailRef"]) return
      this.$refs["UpdateAccountEmailRef"].resetFields()
    },
    resetForm2() {
      if (!this.$refs["UpdateAccountPswdRef"]) return
      this.$refs["UpdateAccountPswdRef"].resetFields()
    },
    resetForm3() {
      if (!this.$refs["UpdateAccountNameRef"]) return
      this.$refs["UpdateAccountNameRef"].resetFields()
    },
    toFollowing() {
      this.$router.push({
        path: `/user/${this.$route.uid}/following`,
      });
    },
    toCreator() {
      const settingid = 'basicInfo'
      this.$router.push({
        path: `/creator/${localStorage.getItem('userId')}/settings/${settingid}`,
      });
    },

    buildNewCollection() {
      // 创建收藏夹
      this.dialogBuildCollectionVisible = true;
    },
    onsubmitBuildCollection() {
      if (this.collectionForm.name == '') {
        ElNotification({
          title: '提示',
          message: '请设置收藏夹名称！',
          type: 'warning',
        })
      }
      else {
        this.submitBuildCollection();
      }
    },
    submitBuildCollection() {
      // 发送创建收藏夹请求
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}/collection`,
        method: 'POST',
        params: {
          name: this.collectionForm.name,
        }
      };
      axios(option).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          // 重新get收藏夹列表
          this.getMyCollections();
          this.dialogBuildCollectionVisible = false;
        } else {
          ElMessage.error(res.data.msg);
        };
      })
    },
    deleteCollection(collectionId: number, collectionName: string) {
      // 删除收藏夹
      ElMessageBox.confirm(`确认删除收藏夹 ${collectionName} 吗?`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 确认
        axios.defaults.headers.common["token"] = localStorage.getItem('token');
        console.log('yes');
        const optionx = {
          method: 'DELETE',
          url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}/collection`,
          params: {
            collectionId: collectionId,
          },
        };
        axios(optionx).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            // 重新get收藏夹列表
            this.getMyCollections();
          } else {
            ElMessage.error(res.data.msg);
          };
        });
      }).catch(() => {
        // 取消
      })
    },
    getArticalByCollection(collectionId: number, ListI: number) {
      // 获得某收藏夹下的文章列表
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const optionx = {
        url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}/collection`,
        method: 'GET',
        params: {
          collectionId: collectionId,
          curPage: 1,
        }
      };
      axios(optionx).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.myCollectionList[ListI].articalList = res.data.data.records;
          console.log(this.myCollectionList[ListI].articalList)
          // 展示文章列表
          this.myCollectionList[ListI].listArticalStatus = false;
        } else {
          ElMessage.error(res.data.msg);
        };

      })
    },

    buildNewColumn() {
      // 创建专栏
      this.dialogBuildColumnVisible = true;
    },
    onsubmitBuildColumn() {
      if (this.columnForm.name == '') {
        ElNotification({
          title: '提示',
          message: '请设置专栏名称！',
          type: 'warning',
        })
      }
      else {
        this.submitBuildColumn();
      }
    },
    submitBuildColumn() {
      // 发送创建专栏
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/column/add`,
        method: 'POST',
        params: {
          name: this.columnForm.name,
        }
      };
      axios(option).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          // 重新get专栏列表
          this.getMyColumns(1);
          this.dialogBuildColumnVisible = false;
        } else {
          ElMessage.error(res.data.msg);
        };
      })
    },
    deleteColumn(columnId: number, columnName: string) {
      // 删除专栏
      ElMessageBox.confirm(`确认删除专栏 ${columnName} 吗?`, 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 确认
        axios.defaults.headers.common["token"] = localStorage.getItem('token');
        console.log('yes');
        const optionx = {
          method: 'POST',
          url: `https://pd54419854.imdo.co/column/${columnId}/remove`,
        };
        axios(optionx).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            // 重新get收专栏列表
            this.getMyColumns(1);
          } else {
            ElMessage.error(res.data.msg);
          };
        });
      }).catch(() => {
        // 取消
      })
    },
    getArticalByColumn(columnId: number, ListI: number) {
      // 获得某专栏下的文章列表
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const optionx = {
        url: `https://pd54419854.imdo.co/column/${columnId}/view`,
        method: 'GET',
        params: {
          columnId: columnId,
          curPage: 1,
        }
      };
      axios(optionx).then((res) => {
        console.log(res.data);
        this.myColumnList[ListI].articalList = res.data.data.records;
        console.log(this.myColumnList[ListI].articalList)
        // 展示文章列表
        this.myColumnList[ListI].listArticalStatus = false;
      })
    },
    onAddArticalToColumn(articalId: any) {
      // 打开抽屉渲染专栏列表
      console.log('open')
      this.columnDrawer = true;
      this.articalId = articalId;
      // this.getMyColumns(1);
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        method: 'GET',
        url: `https://pd54419854.imdo.co/column/user/${this.$route.params.uid}/add-view`,
        params: {
          curPage: 1,
          blogId: articalId,
        }
      };
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.myColumnList = res.data.data.records;
          // this.totalItemColumn = res.data.data.total;
          for (var i = 0; i < this.myColumnList.length; i++) {
            this.myColumnList[i].listArticalStatus = true;
            this.myColumnList[i].articalList = [];
          }
          console.log(this.myColumnList);
        } else {
          ElMessage.error(res.data.msg);
        };

      })
    },
    selectColumn(columnId: number, columnName: string, index: number) {
      if (this.myColumnList[index].isBlogContained) {
        // 移出操作
        ElMessageBox.confirm(`确认移出专栏 ${columnName} 吗?`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        }).then(() => {
          // 确认
          axios.defaults.headers.common["token"] = localStorage.getItem('token');
          const option = {
            method: 'DELETE',
            url: `https://pd54419854.imdo.co/column/${columnId}`,
            params: {
              blogId: this.articalId,
            }
          };
          axios(option).then((res) => {
            console.log(res.data);
            if (res.data.code == 0) {
              // 改变专栏状态图标
              this.myColumnList[index].isBlogContained = false;
              this.myColumnList[index].blogNum--;
            } else {
              ElMessage.error(res.data.msg);
            };
          })
        }).catch(() => {
          // 取消
        })
      } else {
        ElMessageBox.confirm(`确认加入专栏 ${columnName} 吗?`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        }).then(() => {
          // 确认
          axios.defaults.headers.common["token"] = localStorage.getItem('token');
          const option = {
            method: 'PUT',
            url: `https://pd54419854.imdo.co/column/${columnId}`,
            params: {
              blogId: this.articalId,
            }
          };
          axios(option).then((res) => {
            console.log(res.data);
            if (res.data.code == 0) {
              // 改变专栏状态图标
              this.myColumnList[index].isBlogContained = true;
              this.myColumnList[index].blogNum++;
            } else {
              ElMessage.error(res.data.msg);
            };
          })
        }).catch(() => {
          // 取消
        })
      }
    },
    removeBlogFromCollection(blogId: any, collectionId: any, ListI: any) {
      // 从收藏夹中移出博客
      ElMessageBox.confirm(`确认移除吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        // 确认
        axios.defaults.headers.common["token"] = localStorage.getItem('token');
        const option = {
          method: 'DELETE',
          url: `https://pd54419854.imdo.co/userinfo/${this.$route.params.uid}/collection/blog`,
          data: {
            collectionId: collectionId,
            blogId: blogId,
          }
        };
        axios(option).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            // 重新渲染
            this.getArticalByCollection(collectionId, ListI);
          } else {
            ElMessage.error(res.data.msg);
          };
        })
      }).catch(() => {
        // 取消
      })

    },
    removeBlogFromColumn(blogId: any, columnId: any, ListI: any) {
      // 从收藏夹中移出博客
      ElMessageBox.confirm(`确认移除吗?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        // 确认
        axios.defaults.headers.common["token"] = localStorage.getItem('token');
        const option = {
          method: 'DELETE',
          url: `https://pd54419854.imdo.co/column/${columnId}`,
          params: {
            blogId: blogId,
          }
        };
        axios(option).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            // 重新渲染
            this.getArticalByColumn(columnId, ListI);
          } else {
            ElMessage.error(res.data.msg);
          };
        })
      }).catch(() => {
        // 取消
      })

    },

    handleCurrentChangeArtical(val: number) {
      // 文章
      console.log(val);
      // 发送第val页的get请求
      this.getMyArtical(val);
    },
    handleCurrentChangeColumn(val: number) {
      // 专栏
      console.log(val);
      // 发送第val页的get请求
      this.getMyColumns(val);
    }
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-header>
          <el-card>
            <el-avatar class="avatar" shape="square" :src="userform.iconUrl" :size="80" />
            <el-descriptions class="info-card" :column="1">
              <el-descriptions-item class-name="my-content">
                {{ userform.nickname }}
                <el-icon color="pink" v-show="this.userform.sex == '女'">
                  <Female />
                </el-icon>
                <el-icon color="blue" v-show="this.userform.sex == '男'">
                  <Male />
                </el-icon>
              </el-descriptions-item>
              <el-descriptions-item label="个人介绍：">
                {{ userform.intro ? userform.intro : '这个人很懒，还没有简介哦。' }}
              </el-descriptions-item>

              <el-descriptions-item>

                <el-button type="primary" plain @click="toCreator" v-show="isOwner">
                  <Edit style="width: 1em; height: 1em; margin-right: 8px" />设置
                </el-button>
                <el-button type="primary" round v-show="!isOwner">关注</el-button>
                <el-button type="primary" round v-show="!isOwner">私信</el-button>
              </el-descriptions-item>

            </el-descriptions>
            <el-descriptions class="info-card" title="个人信息" :column="2">
              <el-descriptions-item label="生日:">{{ userform.birthday ? userform.birthday : '暂无' }}</el-descriptions-item>
              <el-descriptions-item label="专业：">{{ userform.profession ? userform.profession : '暂无'
              }}</el-descriptions-item>
              <el-descriptions-item label="领域：">
                <el-tag size="small" v-for="tag in userform.label ? userform.label : ['暂无']">
                  {{ tag }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions class="info-card" title="联系账号：">
              <el-descriptions-item label="QQ:">{{ userform.qq ? userform.qq : '暂无' }}</el-descriptions-item>
              <el-descriptions-item label="邮箱:">{{ userform.email ? userform.email : '暂无' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-header>
        <el-main>
          <el-card>
            <el-tabs v-model="tabName" @tab-click="handleClick">

              <el-tab-pane name="first" label="动态">
                <el-card v-for="i in samples" :key="i.blogid" class="infinite-list-item" shadow="hover"
                  style="height: 220px;text-align: left;font-size: 17px;color: #6e6e6e;">
                  <template #header>
                    <div class="card-header">
                      <h3 @click="toBlog(i.blogid)" style="cursor: pointer;">{{ i.title }}</h3>
                      <el-tag v-for="tag in i.blogtags" @click="toTag(tag)" style="cursor: pointer;">{{ tag }}</el-tag>
                    </div>
                  </template>
                  <div @click="toAuther(i.autheruid)">
                    <div style="font-size:20px;line-height: 1.2;float:right;cursor: pointer;vertical-align: middle;">
                      <el-avatar :src="i.authericon" /><span>{{ i.auther }}</span>
                    </div>
                  </div>
                  <span @click="toBlog(i.blogid)">{{ i.blogBrief }}</span>
                </el-card>
              </el-tab-pane>

              <el-tab-pane name="second" label="文章">
                <div>
                  <h1 style="text-align: left;margin-left: 20px;">共{{ totalItemArtical }}篇文章：
                    <el-pagination v-model:current-page="currentPageArtical" :small="false" :disabled="false"
                      :background="true" layout="prev, pager, next, jumper" :total="totalItemArtical"
                      @current-change="handleCurrentChangeArtical" style="float: right;margin-right: 30px;" />
                  </h1>
                </div>
                <el-card v-for="i in myArticalList" :key="i.blogId" class="infinite-list-item" shadow="hover"
                  style="height: 180px;text-align: left;font-size: 17px;color: #3a3a3a;margin:18px;">
                  <template #header>
                    <div style="height: 40px;">
                      <h3><span @click="toBlog(i.blogId)" style="cursor: pointer;">{{ i.title }}</span><span
                          v-show="isOwner" @click="onAddArticalToColumn(i.blogId)"
                          style="float:right;font-size: 15px;color:green;cursor:pointer;"><el-icon>
                            <DocumentAdd />
                          </el-icon>添加进专栏</span></h3>
                      <el-tag v-for="tag in i.blogLabels" @click="toTag(tag)" style="cursor: pointer;">{{ tag }}</el-tag>
                    </div>
                  </template>
                  <div @click="toAuther(i.autherId)">
                    <div style="font-size:20px;line-height: 1.2;float:right;cursor: pointer;vertical-align: middle;">
                      <el-avatar :src="i.autherAvatar" /><span>{{ i.auther }}</span>
                    </div>
                  </div>
                  <span @click="toBlog(i.blogId)">{{ i.blogBrief }}</span>
                </el-card>
              </el-tab-pane>

              <el-tab-pane name="third" label="专栏">

                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="float: left;font-size: 20px;">
                      <el-icon>
                        <Files />
                      </el-icon>{{ isOwner ? '我的专栏' : '专栏' }}({{ myColumnList.length }})
                    </span>
                    <span style="float: right;cursor:pointer;" @click="buildNewColumn" v-show="isOwner">
                      <el-button type="primary" plain>
                        <el-icon>
                          <Plus />
                        </el-icon>创建新的专栏
                      </el-button>
                    </span><el-pagination v-model:current-page="currentPageColumn" :small="false" :disabled="false"
                      :background="true" layout="prev, pager, next, jumper" :total="totalItemColumn"
                      @current-change="handleCurrentChangeColumn" style="float: right;margin-right: 30px;" />
                  </div>

                  <div>
                    <el-empty v-if="myColumnList.length == 0" description=暂时没有专栏哦>
                      <el-button type="primary" plain v-show="isOwner">没有专栏，立即创建？</el-button>
                    </el-empty>
                    <div v-else v-for="(item, index) in myColumnList" style="text-align: left;margin: 20px 10px;">
                      <img :src="item.pictureUrl" alt="" style="vertical-align:middle;">
                      <div style="display:inline;">
                        <span style="font-size: large;cursor:pointer;margin-left: 20px;">{{ item.name }}</span>
                        <span @click="deleteColumn(item.id, item.name)"
                          style="float: right;font-size: 16px;color:rgb(247, 101, 101);cursor:pointer;"><el-icon>
                            <EditPen />
                          </el-icon>删除</span>
                      </div>
                      <div style="font-size: 15px;padding:8px 0;"><span style="cursor:pointer;">{{ item.blogNum
                      }}篇文章</span>
                        <span v-if="item.listArticalStatus"
                          style="margin-left: 10px;color: rgb(156, 149, 250);cursor:pointer;"
                          @click="getArticalByColumn(item.id, index)">查看内容</span>
                        <span v-else>
                          <span @click="item.listArticalStatus = true"
                            style="margin-left: 10px;color: rgb(156, 149, 250);cursor:pointer;">收起内容</span>
                          <div
                            style="background-color: rgb(211, 233, 247);border-radius: 20px;border:1px soild #3a3a3a;padding:10px;">
                            <div v-if="item.articalList.length == 0">该专栏下暂时没有文章哦</div>
                            <div class="show-page-box" v-else v-for="i in item.articalList" :key="i.blogId">
                              <h2 class="content" style="margin:auto;"><span @click="toBlog(i.blogId)"
                                  style="cursor: pointer;margin:auto;"><svg t="1699546631495" class="icon"
                                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2677"
                                    width="20" height="20">
                                    <path
                                      d="M863.418182 698.181818c-13.963636 0-23.272727 9.309091-23.272727 23.272727v186.181819c0 39.563636-25.6 69.818182-69.818182 69.818181H134.981818c-41.890909 0-86.109091-30.254545-86.109091-69.818181V114.036364C48.872727 74.472727 93.090909 46.545455 134.981818 46.545455h635.345455c44.218182 0 69.818182 30.254545 69.818182 69.818181v325.818182c0 13.963636 9.309091 23.272727 23.272727 23.272727s23.272727-9.309091 23.272727-23.272727V116.363636c0-65.163636-46.545455-116.363636-116.363636-116.363636H134.981818C69.818182 0 2.327273 46.545455 2.327273 114.036364V907.636364c0 69.818182 69.818182 116.363636 132.654545 116.363636h635.345455c69.818182 0 116.363636-51.2 116.363636-116.363636v-186.181819c0-13.963636-11.636364-23.272727-23.272727-23.272727z m153.6-260.654545c-9.309091-9.309091-23.272727-9.309091-32.581818 0L512 889.018182c-9.309091 9.309091-9.309091 23.272727 0 32.581818 9.309091 9.309091 23.272727 9.309091 32.581818 0l472.436364-451.490909c6.981818-6.981818 6.981818-23.272727 0-32.581818zM630.690909 302.545455h-372.363636c-13.963636 0-23.272727 9.309091-23.272728 23.272727s9.309091 23.272727 23.272728 23.272727h372.363636c13.963636 0 23.272727-9.309091 23.272727-23.272727s-11.636364-23.272727-23.272727-23.272727z m0 232.727272h-372.363636c-13.963636 0-23.272727 9.309091-23.272728 23.272728s9.309091 23.272727 23.272728 23.272727h372.363636c13.963636 0 23.272727-9.309091 23.272727-23.272727s-11.636364-23.272727-23.272727-23.272728z"
                                      fill="#666666" p-id="2678"></path>
                                  </svg>标题：{{ i.title }}</span><span v-show="isOwner"
                                  @click="removeBlogFromColumn(i.blogId, item.id, index)"
                                  style="float: right;color:red;cursor:pointer;"><el-icon>
                                    <DeleteFilled />
                                  </el-icon>移除</span></h2>
                            </div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane name="fourth" label="收藏夹">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <span style="float: left;font-size: 20px;">
                      <el-icon>
                        <Star />
                      </el-icon>{{ isOwner ? '我的收藏夹' : '收藏夹' }}({{ myCollectionList.length }})
                    </span>
                    <span style="float: right;cursor:pointer;" @click="buildNewCollection" v-show="isOwner">
                      <el-button type="primary" plain>
                        <el-icon>
                          <Plus />
                        </el-icon>创建新的收藏夹
                      </el-button>
                    </span>
                  </div>

                  <div>
                    <el-empty v-if="myCollectionList.length == 0" description=暂时没有收藏夹哦>
                      <el-button type="primary" plain v-show="isOwner">没有收藏夹，立即创建？</el-button>
                    </el-empty>
                    <div v-else v-for="(item, index) in myCollectionList" style="text-align: left;margin: 20px 10px;">
                      <div><span style="font-size: large;cursor:pointer;"><svg t="1699546724864" class="icon"
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3920"
                            width="20" height="20">
                            <path
                              d="M787.3024 896.4096H239.9232c-81.8688 0-148.2752-66.3552-148.2752-148.2752V276.7872c0-81.8688 66.3552-148.2752 148.2752-148.2752H400.384c18.1248 0 35.5328 7.2192 48.3328 20.0704l106.9568 107.264c12.8 12.8512 30.208 20.0704 48.3328 20.0704h183.296c81.8688 0 148.2752 66.3552 148.2752 148.2752v323.9424c0 81.92-66.4064 148.2752-148.2752 148.2752z"
                              fill="#FF5D50" p-id="3921"></path>
                            <path
                              d="M557.4144 379.5456l28.2624 57.2928a48.82432 48.82432 0 0 0 36.7616 26.7264l63.232 9.1648c40.0896 5.8368 56.064 55.04 27.0848 83.3024l-45.7728 44.5952a48.7936 48.7936 0 0 0-14.0288 43.2128l10.8032 62.976c6.8608 39.8848-35.0208 70.3488-70.8608 51.5072l-56.576-29.7472a48.896 48.896 0 0 0-45.4656 0l-56.576 29.7472c-35.84 18.8416-77.7216-11.5712-70.8608-51.5072l10.8032-62.976c2.7136-15.8208-2.56-32-14.0288-43.2128l-45.7728-44.5952c-28.9792-28.2624-13.0048-77.5168 27.0848-83.3024l63.232-9.1648c15.9232-2.304 29.6448-12.288 36.7616-26.7264l28.2624-57.2928c17.9712-36.3008 69.7344-36.3008 87.6544 0z"
                              fill="#FFDF99" p-id="3922"></path>
                          </svg>{{ item.name }}</span>
                        <span @click="deleteCollection(item.id, item.name)"
                          style="float: right;font-size: 16px;color:rgb(247, 101, 101);cursor:pointer;"><el-icon>
                            <EditPen />
                          </el-icon>删除</span>
                      </div>
                      <div style="font-size: 15px;padding:8px 0;"><span style="cursor:pointer;">{{ item.size }}篇文章</span>
                        <span v-if="item.listArticalStatus"
                          style="margin-left: 10px;color: rgb(156, 149, 250);cursor:pointer;"
                          @click="getArticalByCollection(item.id, index)">查看内容</span>
                        <span v-else>
                          <span @click="item.listArticalStatus = true"
                            style="margin-left: 10px;color: rgb(156, 149, 250);cursor:pointer;">收起内容</span>
                          <div
                            style="background-color: rgb(211, 233, 247);border-radius: 20px;border:1px soild #3a3a3a;padding:10px;">
                            <div v-show="item.articalList.length != 0">页数</div>
                            <div v-if="item.articalList.length == 0">该收藏夹下没有文章哦</div>
                            <div v-else class="show-page-box" v-for="i in item.articalList" :key="i.blogId">
                              <h2 class="content" style="margin:auto;">
                                <span @click="toBlog(i.blogId)" style="cursor: pointer;margin:auto;">
                                  <svg t="1699546631495" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="2677" width="20" height="20">
                                    <path
                                      d="M863.418182 698.181818c-13.963636 0-23.272727 9.309091-23.272727 23.272727v186.181819c0 39.563636-25.6 69.818182-69.818182 69.818181H134.981818c-41.890909 0-86.109091-30.254545-86.109091-69.818181V114.036364C48.872727 74.472727 93.090909 46.545455 134.981818 46.545455h635.345455c44.218182 0 69.818182 30.254545 69.818182 69.818181v325.818182c0 13.963636 9.309091 23.272727 23.272727 23.272727s23.272727-9.309091 23.272727-23.272727V116.363636c0-65.163636-46.545455-116.363636-116.363636-116.363636H134.981818C69.818182 0 2.327273 46.545455 2.327273 114.036364V907.636364c0 69.818182 69.818182 116.363636 132.654545 116.363636h635.345455c69.818182 0 116.363636-51.2 116.363636-116.363636v-186.181819c0-13.963636-11.636364-23.272727-23.272727-23.272727z m153.6-260.654545c-9.309091-9.309091-23.272727-9.309091-32.581818 0L512 889.018182c-9.309091 9.309091-9.309091 23.272727 0 32.581818 9.309091 9.309091 23.272727 9.309091 32.581818 0l472.436364-451.490909c6.981818-6.981818 6.981818-23.272727 0-32.581818zM630.690909 302.545455h-372.363636c-13.963636 0-23.272727 9.309091-23.272728 23.272727s9.309091 23.272727 23.272728 23.272727h372.363636c13.963636 0 23.272727-9.309091 23.272727-23.272727s-11.636364-23.272727-23.272727-23.272727z m0 232.727272h-372.363636c-13.963636 0-23.272727 9.309091-23.272728 23.272728s9.309091 23.272727 23.272728 23.272727h372.363636c13.963636 0 23.272727-9.309091 23.272727-23.272727s-11.636364-23.272727-23.272727-23.272728z"
                                      fill="#666666" p-id="2678"></path>
                                  </svg>标题：{{
                                    i.blogTitle }}</span><span @click="removeBlogFromCollection(i.blogId, item.id, index)"
                                  style="float: right;color:red;cursor:pointer;"><el-icon>
                                    <DeleteFilled />
                                  </el-icon>移除</span>
                              </h2>
                            </div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </el-tab-pane>
              <el-tab-pane name="fifth" label="关注">
                <h1>我的关注 name=fifth</h1>
              </el-tab-pane>
              <el-tab-pane name="sixth" label="赞过">
                <h1>我的赞过 name=sixth</h1>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-main>
      </el-container>
      <el-aside>
        <el-card>
          <div>
            <el-icon>
              <Management />
            </el-icon>
            我的成就
          </div>
        </el-card>
        <el-card>
          <div>
            <el-icon>
              <Star />
            </el-icon>
            收藏集
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
  <el-dialog v-model="dialogBuildCollectionVisible" title="创建新收藏夹">
    <el-form :model="collectionForm">
      <el-form-item prop:name label="收藏夹名称">
        <el-input v-model="collectionForm.name" placeholder="请设置新收藏夹的名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogBuildCollectionVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmitBuildCollection">
          确认创建
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogBuildColumnVisible" title="创建新专栏">
    <el-form :model="columnForm">
      <el-form-item prop:name label="专栏名称">
        <el-input v-model="columnForm.name" placeholder="请设置新专栏的名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogBuildColumnVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmitBuildColumn">
          确认创建
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-drawer v-model="columnDrawer" title="请选择专栏" direction="btt" style="font-size: 20px;height:fit-content;">
    <div v-for="(item, index) in myColumnList" style="text-align: left;margin: 20px 100px;">
      <div>
        <span style="font-size: large;cursor:pointer;">{{ item.name }}</span>
        <span @click="selectColumn(item.id, item.name, index)"
          style="float: right;font-size: 16px;color:rgb(101, 155, 247);cursor:pointer;">
          <span>
            <svg v-if="item.isBlogContained" t="1699626915616" class="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="4171" width="20" height="20">
              <path
                d="M127.74 255.81h768.04c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.67-42.67H127.74c-23.57 0-42.67 19.1-42.67 42.67s19.11 42.67 42.67 42.67zM895.79 767.84H127.74c-23.57 0-42.67 19.1-42.67 42.67s19.1 42.67 42.67 42.67h768.04c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.66-42.67zM127.74 554.49h113.78c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.67-42.67H127.74c-23.57 0-42.67 19.1-42.67 42.67s19.11 42.67 42.67 42.67zM895.79 469.15H782c-23.57 0-42.67 19.1-42.67 42.67s19.1 42.67 42.67 42.67h113.78c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.66-42.67zM522.32 386.46l-10.06 10.06-10.06-10.06c-38.88-38.88-101.92-38.88-140.8 0s-38.88 101.92 0 140.8L492.14 658c11.11 11.11 29.12 11.11 40.23 0l127.79-127.79c38.55-38.55 42.46-101.87 5.09-141.55-38.67-41.06-103.33-41.8-142.93-2.2z m80.46 80.46l-90.52 90.51-90.52-90.51c-5.55-5.55-5.55-14.57 0-20.11 5.55-5.55 14.57-5.55 20.12 0l10.06 10.06 40.23 40.23c11.11 11.11 29.12 11.11 40.23 0l40.23-40.23 10.06-10.06c5.55-5.55 14.57-5.55 20.12 0 5.53 5.54 5.53 14.57-0.01 20.11z"
                fill="#f4ea2a" p-id="4172"></path>
            </svg>
            <svg v-else t="1699626915616" class="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="4171" width="20" height="20">
              <path
                d="M127.74 255.81h768.04c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.67-42.67H127.74c-23.57 0-42.67 19.1-42.67 42.67s19.11 42.67 42.67 42.67zM895.79 767.84H127.74c-23.57 0-42.67 19.1-42.67 42.67s19.1 42.67 42.67 42.67h768.04c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.66-42.67zM127.74 554.49h113.78c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.67-42.67H127.74c-23.57 0-42.67 19.1-42.67 42.67s19.11 42.67 42.67 42.67zM895.79 469.15H782c-23.57 0-42.67 19.1-42.67 42.67s19.1 42.67 42.67 42.67h113.78c23.57 0 42.67-19.1 42.67-42.67s-19.1-42.67-42.66-42.67zM522.32 386.46l-10.06 10.06-10.06-10.06c-38.88-38.88-101.92-38.88-140.8 0s-38.88 101.92 0 140.8L492.14 658c11.11 11.11 29.12 11.11 40.23 0l127.79-127.79c38.55-38.55 42.46-101.87 5.09-141.55-38.67-41.06-103.33-41.8-142.93-2.2z m80.46 80.46l-90.52 90.51-90.52-90.51c-5.55-5.55-5.55-14.57 0-20.11 5.55-5.55 14.57-5.55 20.12 0l10.06 10.06 40.23 40.23c11.11 11.11 29.12 11.11 40.23 0l40.23-40.23 10.06-10.06c5.55-5.55 14.57-5.55 20.12 0 5.53 5.54 5.53 14.57-0.01 20.11z"
                fill="#1A1A1A" p-id="4172"></path>
            </svg>
            选择
          </span>
        </span>
      </div>
      <div style="font-size: 15px;padding:8px 0;"><span style="cursor:pointer;">{{ item.blogNum }}篇文章</span>
      </div>
    </div>
  </el-drawer>
</template>
<style>
.show-page-box {
  background-color: rgb(249, 241, 231);
  border-bottom-left-radius: 200px 500px;
  border-bottom-right-radius: 500px 30px;
  border-top-right-radius: 500px 400px;
  border: 1px soild #3a3a3a;
  padding: 10px;
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.16);
  height: 60px;
  text-align: left;
  color: #3a3a3a;
}

.show-page-box .content {
  position: relative;
  z-index: 2;
  font-size: 18px;
  text-align: left;
  padding: 10px;
}

.common-layout {
  width: 80%;
  align-self: center;
  text-align: center;
  align-items: center;
  margin: 0 auto;
  padding: 5px;
}

.el-header {
  height: fit-content;
  padding-top: 20px;
  background-color: white;
  margin-top: 30px;
  border-radius: 5px;
  padding: 10px;

  .avatar {
    margin: 20px;
    float: left;
  }

  .info-card {
    margin: 20px;
    padding: 10px;
    float: left;
  }
}

.el-descriptions__content {
  margin: 10px;
  padding: 10px;
}

.my-content {
  font: 1.5em sans-serif;
}

.myinfo-change {
  font: 1.0em sans-serif;
  cursor: pointer;
}

.myinfo-change:hover {
  color: rgb(42, 174, 86);
}

.el-aside {
  margin-top: 50px;
  width: 20%;
  position: relative;
  font-size: large;

  .el-card {
    height: fit-content;
    margin: 10px 20px;
  }
}

.el-main {
  height: fit-content;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}</style>