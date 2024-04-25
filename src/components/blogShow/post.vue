<script lang="ts">
import axios from 'axios';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { id } from 'element-plus/es/locale';
import { getCurrentInstance, h, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
export default {
  name: '博客内容',
  created() {
    if (this.$route.params.blogid == 0) {
      this.blogContent= {
        title: '前端第一次培训',
        auther: 'syc',
        autherId: 0,
        autherAvatar: '',
        files: [],
        collectNum: 0,
        commentNum: 0,
        likeNum: 0,
        readNum: 0,
        likeStatus: false,
        collectedStatus: false,
        createTime: 0,
        updateTime: 0,
        content: `CSS伪类与伪元素
伪类
        伪类是选择器的一种，它用于选择处于特定状态的元素，比如当它们是这一类型的第一个元素时，或者是当鼠标指针悬浮在元素上面的时候。它们表现得会像是你向你的文档的某个部分应用了一个类一样，帮你在你的标记文本中减少多余的类，让你的代码更灵活、更易于维护。

以：开头
伪元素
        创建一些不在文档树中的元素，并为其添加样式。(就是选取某些元素前面或后面这种普通选择器无法完成的工作,虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。)

以:: 开头
demo  

随机提问
网站的导航菜单中，只需要选中一级菜单项而不包括下拉菜单项。
网页中的标题与下面的段落之间设置特定样式。
对整个网页内容的样式进行设置，或者选择某个容器内的所有子元素。
对一组相邻的列表项或卡片进行样式设置。
css关系选择器代码测试

题目 1：

在一个网页中，有一个包含多个 <div> 元素的容器，每个 <div> 元素内部包含一个 <span> 元素作为其直接子元素。现在需要对每个 <span> 元素应用特定的样式，要求将其字体加粗。

题目 2：

在一个页面中，有一组图片和它们对应的标题。每个图片和标题都被包含在一个 <div> 元素中，图片是 <div> 元素的直接子元素，而标题是图片的兄弟元素，位于图片之后。现在需要对每个图片的标题应用特定样式，要求将标题的文字大小设为16像素。

题目 3：

一个网站的页脚包含了一组链接，每个链接都是 <a> 元素，链接之间是兄弟关系。现在需要对所有链接之间的间距进行调整，要求将链接之间的右边距设为10像素。

题目 4：

在一个列表中，每个列表项都包含了一个标题和一个段落。标题和段落是兄弟元素关系，排列在同一级别。现在需要对每个列表项中的段落应用特定样式，要求将段落的文字颜色设置为灰色。

 CSS布局`,
        labels: ['前端', 'React', 'Node.js'],
      };
      return;
    }
    // 获得博客内容
    if (localStorage.getItem('token') && localStorage.getItem('userId')) {
      // 登录状态
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/blog/user/view/${this.$route.params.blogid}`,
        method: 'GET',
      };
      axios(option).then((res) => {
        // console.log(res.data);
        if (res.data.code == 0) {
          this.blogContent = res.data.data;
          var d = new Date(this.blogContent.createTime);
          var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
          this.blogContent.createTime = ds;
          d = new Date(this.blogContent.updateTime);
          ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
          this.blogContent.updateTime = ds;

          // 获得一级评论区
          const getCommentData = {
            page: 1,
            parentCommentId: 0,
            order: 'hot',
          }
          const optionx = {
            url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comments`,
            method: 'GET',
            params: getCommentData
          }
          axios(optionx).then((res) => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.commentData = res.data.data;
              this.totalItemComment = res.data.data.total;
              for (var i = 0; i < this.commentData.records.length; i++) {
                var d = new Date(this.commentData.records[i].createTime);
                var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
                this.commentData.records[i].createTime = ds;
                this.commentData.records[i].replyStatus = false;
                this.commentData.records[i].listCommentStatus = true;
                this.commentData.records[i].childComments = [];
              }
              // 获得作者信息渲染名片
              this.autherForm.userId = this.blogContent.autherId;
              const optiony = {
                url: `https://pd54419854.imdo.co/userinfo/${this.blogContent.autherId}`,
                method: 'GET',
              };
              axios(optiony).then((res) => {
                // console.log(res.data)
                if (res.data.code == 0) {
                  this.autherForm.nickname = res.data.data.nickname;
                  this.autherForm.intro = res.data.data.intro;
                  this.autherForm.label = res.data.data.label;

                  // 获得头像
                  const optionz = {
                    url: `https://pd54419854.imdo.co/userinfo/avatar/${this.blogContent.autherId}`,
                    method: 'GET',
                  };
                  axios(optionz).then((res) => {
                    // console.log(res.data);
                    if (res.data.code == 0) {
                      this.autherForm.iconUrl = res.data.data;
                    } else {
                      ElMessage.error(res.data.msg);
                    }
                  })
                }
              });
            }
            else {
              ElMessage.error(res.data.msg);
            }
          })
        }
      });

    } else {
      // 未登录状态
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/blog/view/${this.$route.params.blogid}`,
        method: 'GET',
      };
      axios(option).then((res) => {
        // console.log(res.data);
        if (res.data.code == 0) {
          this.blogContent = res.data.data;
          var d = new Date(this.blogContent.createTime);
          var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
          this.blogContent.createTime = ds;
          d = new Date(this.blogContent.updateTime);
          ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
          this.blogContent.updateTime = ds;

          // 获得一级评论区
          const getCommentData = {
            page: 1,
            parentCommentId: 0,
            order: 'hot',
          }
          const optionx = {
            url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comments`,
            method: 'GET',
            params: getCommentData
          }
          axios(optionx).then((res) => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.commentData = res.data.data;
              this.totalItemComment = res.data.data.total;
              for (var i = 0; i < this.commentData.records.length; i++) {
                var d = new Date(this.commentData.records[i].createTime);
                var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
                this.commentData.records[i].createTime = ds;
                this.commentData.records[i].replyStatus = false;
                this.commentData.records[i].listCommentStatus = true;
                this.commentData.records[i].childComments = [];
              }
              // 获得作者信息渲染名片
              this.autherForm.userId = this.blogContent.autherId;
              const optiony = {
                url: `https://pd54419854.imdo.co/userinfo/${this.blogContent.autherId}`,
                method: 'GET',
              };
              axios(optiony).then((res) => {
                // console.log(res.data)
                if (res.data.code == 0) {
                  this.autherForm.nickname = res.data.data.nickname;
                  this.autherForm.intro = res.data.data.intro;
                  this.autherForm.label = res.data.data.label;

                  // 获得头像
                  const optionz = {
                    url: `https://pd54419854.imdo.co/userinfo/avatar/${this.blogContent.autherId}`,
                    method: 'GET',
                  };
                  axios(optionz).then((res) => {
                    // console.log(res.data);
                    if (res.data.code == 0) {
                      this.autherForm.iconUrl = res.data.data;
                    } else {
                      ElMessage.error(res.data.msg);
                    }
                  })
                }
              });
            }
            else {
              ElMessage.error(res.data.msg);
            }
          })
        }
      });
    }

  },
  setup() {
    let titles = reactive(getTitles());
    let currentTitle = ref({});
    let progress = ref(0);

    function getTitles() {
      let titles = [];
      let levels = ['h1', 'h2', 'h3', 'h4', 'h5'];
      onMounted(() => {
      })

      return titles;
    }
  },
  data() {
    const authStr = {
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      myInfo: JSON.parse(localStorage.getItem('myInfo') || '{}'),
    };
    const blogContent = ref({
      title: '',
      auther: '',
      autherId: '',
      autherAvatar: '',
      files: ref([] as any[]),
      collectNum: 0,
      commentNum: 0,
      likeNum: 0,
      readNum: 0,
      likeStatus: false,
      collectedStatus: false,
      createTime: 0,
      updateTime: 0,
      content: '',
      labels: ['前端', 'React', 'Next.js'],
    });
    const myData = {
      myIcon: localStorage.getItem('userIcon'),
      userId: localStorage.getItem('userId'),
      nickname: authStr.myInfo.nickname,
    };
    const autherForm = {
      userId: '',
      iconUrl: '',
      nickname: '',
      intro: '',
      label: ref([] as any[]),
    }
    var d = new Date(1698815827000);
    var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
    console.log(ds);
    const commentData = reactive({
      records: [
        {
          id: 1,
          userId: 51,
          content: "继续加油！",
          userNickname: "Deepwind深岚",
          userAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          likeNum: 0,
          createTime: ds,
          parentCommentId: null,
          parentUserId: null,
          parentUsername: null,
          likeStatus: true,
          replyStatus: false,
          listCommentStatus: false,
          childComments: {
            records: ref([] as any[]),
            total: 1,
            size: 10,
            current: 1,
            orders: [],
            optimizeCountSql: true,
            searchCount: true,
            maxLimit: null,
            countId: null,
            pages: 1
          },
        }
      ],
      total: 1,
      size: 10,
      current: 1,
      orders: [],
      optimizeCountSql: true,
      searchCount: true,
      maxLimit: null,
      countId: null,
      pages: 1
    });
    const mycomment = ref('');
    const mycommentReply = ref('');
    const blogContainer = ref('#blogContainer');
    const emojis = [
      '😀', '😄', '😅', '🤣', '😂', '😉', '😊', '😍', '😘', '😜',
      '😝', '😏', '😒', '🙄', '😔', '😴', '😷', '🤮', '🥵', '😎',
      '😮', '😰', '😭', '😱', '😩', '😡', '💀', '👽', '🤓', '🥳',
      '😺', '😹', '😻', '🤚', '💩', '👍', '👎', '👏', '🙏', '💪'
    ];

    const collectDrawer = ref(false);

    const myCollectionList = ref([] as any[]);
    const currentPageComment = ref(1);
    const totalItemComment = ref(0);
    const dialogBuildAccuseVisible = ref(false);

    const accuseForm = reactive({
      content: '',
      brief: '',
    });
    const accuseId = ref(0);
    const accuseType = ref(0);
    return {
      accuseId,accuseType,
      accuseForm,
      authStr,dialogBuildAccuseVisible,
      totalItemComment, currentPageComment,
      emojis,
      blogContainer,
      blogContent,
      myData, autherForm,
      mycomment,
      mycommentReply,
      commentData,
      collectDrawer,
      myCollectionList,
    }
  },
  methods: {
    toUser() {
      this.$router.push({
        path: `/user/${this.autherForm.userId}`,
      });
    },
    toTag(tag: any) {
      this.$router.push({
        path: `/topic/${tag}`,
      })
    },
    toFollowing() {
      this.$router.push({
        path: `/creator/${this.autherForm.userId}/settings/myfollowings`,
      })
    },
    toFollowers() {
      this.$router.push({
        path: `/creator/${this.autherForm.userId}/settings/myfollowers`,
      })
    },
    handleClick() {
      console.log('click');
    },
    submitMyComment() {
      if (this.authStr.isloged) {
        // 登录状态可操作
        if (!this.mycomment) {
          ElNotification({
            title: '提示',
            message: h('i', { style: 'color: teal' }, '请不要提交空白评论哦😶‍🌫️'),
          });
          return;
        }
        else {
          axios.defaults.headers.common["token"] = localStorage.getItem('token');
          const commentData = {
            content: this.mycomment,
            parentCommentId: null,
            replyCommentId: null,
          };
          const option = {
            url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comment`,
            method: 'POST',
            data: commentData,
          };
          axios(option).then((res) => {
            if (res.data.code == 0) {
              ElNotification({
                title: '提示',
                message: h('i', { style: 'color:green' }, '发表评论成功！'),
              });
              this.mycomment = '';
              // 更新评论到评论区
              const getCommentData = {
                page: 1,
                parentCommentId: 0,
                order: 'hot',
              }
              const optionx = {
                url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comments`,
                method: 'GET',
                params: getCommentData
              }
              axios(optionx).then((res) => {
                this.commentData = res.data.data;
                for (var i = 0; i < this.commentData.records.length; i++) {
                  var d = new Date(this.commentData.records[i].createTime);
                  var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
                  this.commentData.records[i].createTime = ds;
                }
              });
            } else {
              ElNotification({
                title: '提示',
                message: h('i', { style: 'color:red' }, res.data.msg),
              })
            }
          })
        }
      }
      else {
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再发表评论！'),
        });
      }
    },
    likeBlog() {
      // console.log('like!');
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再点赞！'),
        });
        return;
      }
      let typei = 0;
      if (this.blogContent.likeStatus == false) {
        typei = 1;
      }
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/like`,
        method: 'POST',
        data: {
          type: typei
        }
      };
      axios(option).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          this.blogContent.likeStatus = !this.blogContent.likeStatus;
        }
      });
    },
    oncollectBlog() {
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再收藏博客！'),
        });
        return;
      }

      this.collectDrawer = !this.collectDrawer;
      // 获得收藏夹列表
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        method: 'GET',
        url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/collections`,
      };
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.myCollectionList = res.data.data;
          console.log(this.myCollectionList);
        }
        else {
          ElMessage.error(res.data.msg);
        }
      })
    },
    selectCollection(listI:number,collectionId: any, collectionName: string, colltionStatus: boolean) {
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再收藏！'),
        });
        return;
      }

      if (!colltionStatus) {
        // 不包含，添加进收藏夹
        ElMessageBox.confirm(`确认选择收藏夹 ${collectionName} 吗?`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        }).then(() => {
          // 确认
          axios.defaults.headers.common["token"] = localStorage.getItem('token');
          const option = {
            method: 'POST',
            url: `https://pd54419854.imdo.co/userinfo/${this.myData.userId}/collection/blog`,
            data: {
              collectionId: collectionId,
              blogId: this.$route.params.blogid,
            }
          };
          axios(option).then((res) => {
            console.log(res.data);
            if (res.data.code == 0) {
              // 改变收藏状态图标
              this.myCollectionList[listI].include = true;
              // 改变收藏文章数量
              this.myCollectionList[listI].size++;
            } else {
              ElMessage.error(res.data.msg);
            }
          })
        }).catch(() => {
          // 取消
        })
      } else {
        // 包含，移除
        ElMessageBox.confirm(`确认从收藏夹 ${collectionName} 中移除吗?`, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
        }).then(() => {
          // 确认
          axios.defaults.headers.common["token"] = localStorage.getItem('token');
          const option = {
            method: 'DELETE',
            url: `https://pd54419854.imdo.co/userinfo/${this.myData.userId}/collection/blog`,
            data: {
              collectionId: collectionId,
              blogId: this.$route.params.blogid,
            }
          };
          axios(option).then((res) => {
            console.log(res.data);
            if (res.data.code == 0) {
              // 改变收藏状态图标
              this.myCollectionList[listI].include = false;
              // 改变收藏文章数量
              this.myCollectionList[listI].size--;
            } else {
              ElMessage.error(res.data.msg);
            }
          })
        }).catch(() => {
          // 取消
        })
      }
      
    },
    reply(recoudi: number) {
      // 展开评论框
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再评论！'),
        });
        return;
      }

      this.commentData.records[recoudi].replyStatus = !this.commentData.records[recoudi].replyStatus;
    },
    reply2(recordi: number, recordj: number) {
      // 展开二级评论框
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再评论！'),
        });
        return;
      }

      this.commentData.records[recordi].childComments.records[recordj].replyStatus = !this.commentData.records[recordi].childComments.records[recordj].replyStatus;
    },
    onsSubmitReply(commentid?: number, commentj?: number) {
      // 验证
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再评论！'),
        });
        return;
      }
      if (this.mycommentReply == '') {
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color:red' }, '请不要回复空评论哦'),
        })
      }
      else {
        this.submitReply(commentid, commentj);
      }
    },
    submitReply(commentid?: any, commentj?: any) {
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const myComentReplyData = {
        content: this.mycommentReply,
        parentCommentId: commentj,
        replyCommentId: commentid,
      }
      const option = {
        url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comment`,
        method: 'POST',
        data: myComentReplyData,
      }
      console.log(option);
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          ElNotification({
            title: '提示',
            message: h('i', { style: 'color:green' }, '发表评论成功！'),
          });
        }
      })
    },
    listResponse(commentId: number, recordi: number) {
      console.log('获得' + commentId + '的二级评论');
      if (this.commentData.records[recordi].listCommentStatus == true) {
        // 展开评论操作，获得二级评论
        const getCommentData = {
          page: 1,
          parentCommentId: commentId,
          order: '',
        }
        const optionx = {
          url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comments`,
          method: 'GET',
          params: getCommentData
        }
        console.log(optionx);
        axios(optionx).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            this.commentData.records[recordi].childComments = res.data.data;
            for (var i = 0; i < this.commentData.records[recordi].childComments.records.length; i++) {
              var d = new Date(this.commentData.records[recordi].childComments.records[i].createTime);
              var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
              this.commentData.records[recordi].childComments.records[i].createTime = ds;
              this.commentData.records[recordi].childComments.records[i].replyStatus = false;
              this.commentData.records[recordi].childComments.records[i].listCommentStatus = true;
              // this.commentData.records[recordi].childComments.records[i].childComments = [];
            };
          } else {
            ElMessage.error(res.data.msg);
          }

        });
      }
      this.commentData.records[recordi].listCommentStatus = !this.commentData.records[recordi].listCommentStatus;

    },
    touser(uid: any) {
      console.log(uid);
      this.$router.push({
        path: `/user/${uid}`,
      });
    },
    likeComment(commentId: any, likeStute: boolean, recoudi: number) {
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再点赞！'),
        });
        return;
      }

      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      let typei = 0;
      if (likeStute == false) typei = 1;

      const option = {
        url: `https://pd54419854.imdo.co/blog/comment/${commentId}/like`,
        method: 'POST',
        data: {
          type: typei,
        }
      };
      axios(option).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          this.commentData.records[recoudi].likeStatus = !this.commentData.records[recoudi].likeStatus;
          if (typei == 1)
            this.commentData.records[recoudi].likeNum++;
          else
            this.commentData.records[recoudi].likeNum--;
        }
      })
    },
    listEmojis(e: string) {
      console.log(e);
    },
    getComment(curp: number, type: string) {
      // 查询第curp页内容
      const getCommentData = {
        page: curp,
        parentCommentId: 0,
        order: type,
      }
      const optionx = {
        url: `https://pd54419854.imdo.co/blog/${this.$route.params.blogid}/comments`,
        method: 'GET',
        params: getCommentData
      }
      console.log(optionx);
      axios(optionx).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          // 一级评论区
          this.commentData = res.data.data;
          for (var i = 0; i < this.commentData.records.length; i++) {
            var d = new Date(this.commentData.records[i].createTime);
            var ds = d.toLocaleDateString().replace(/\//g, "-") + " " + d.toTimeString().substr(0, 8);
            this.commentData.records[i].createTime = ds;
            this.commentData.records[i].replyStatus = false;
            this.commentData.records[i].listCommentStatus = true;
            this.commentData.records[i].childComments = [];
          }
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    },
    handleCurrentChangeComment(val: number) {
      // 文章
      console.log(val);
      // 发送第val页的get请求
      this.getComment(val, 'hot');//默认按热度
    },
    onAccuseBlogComment(typei: number, id: number) {
      if (!this.authStr.isloged) {
        // 未登录状态不可操作
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请登录后再举报！'),
        });
        return;
      }
      this.accuseId = id;
      this.accuseType = typei;
      // 展示举报信息填写框
      this.dialogBuildAccuseVisible = true;
    },
    onsubmitAccuse() {
      // 表单验证
      if (this.accuseForm.content == '') {
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请填写举报内容！'),
        });
        return;
      }
      if (this.accuseForm.brief == '') {
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: red' }, '请选择举报类型！'),
        });
        return;
      }

      this.submitAccuse();
    },
    submitAccuse() {
      // 举报
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/blog/accuse`,
        method: 'POST',
        data: {
          type: this.accuseType,
          content: this.accuseForm.content,
          brief: this.accuseForm.brief,
          objectId: this.accuseId,
        }
      };
      console.log(option);
      axios(option).then((res) => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.dialogBuildAccuseVisible = false;
          ElNotification({
            title: '提示',
            message: h('i', { style: 'color: green' }, '举报成功！'),
          });
        }
      });
    }
  }
}
</script>


<template>
  <!-- <h1>展示博客内容</h1> -->
  <div style="margin:60px 20px 10px 40px;">
    <el-container>
      <el-container
        style="background-color: rgb(244, 254, 255);margin: 20px 30px;border:2px solid black;border-radius: 20px;">

        <el-header style="margin: 20px;">
          <h1 style="font-size: 23px;">{{ blogContent.title }}</h1>
          <el-divider content-position="right">
            <span style="font-size: large;font-weight: 800;float:left;">{{ blogContent.auther }}</span></el-divider>
          <div style="font-size: 16px;">
            <div>
              <span style="margin: 20px;">浏览量：{{ blogContent.readNum }}</span>
              <span style="margin: 20px;">点赞量：{{ blogContent.likeNum }}</span>
              <span style="margin: 20px;">评论数：{{ blogContent.commentNum }}</span>
              <span style="margin: 20px;">收藏量：{{ blogContent.collectNum }}</span>
            </div>
            <div>
              <span style="margin: 20px;">最近修改于：{{ blogContent.updateTime }}</span>
              <span style="margin: 20px;">发布于：{{ blogContent.createTime }}</span>
            </div>
          </div>
        </el-header>

        <el-main style="margin: 80px 20px;background-color: rgba(235, 244, 255, 0.868);border-radius:20px;">
          <div v-html="blogContent.content"
            style="font-size: 21px;white-space: normal;word-break: break-all;overflow:hidden;" ref="blogContainer">
          </div>

        </el-main>

        <el-footer>
          <div style="margin:0 8px;font-size: 16px;font-weight: 800;">标签：
            <span>
              <el-tag v-for="i in blogContent.labels" size="large" style="margin:0 8px;font-size: 16px;cursor:pointer;">{{
                i }}</el-tag>
            </span>

            <span style="float:right;margin:10px;font-size: 18px;cursor:pointer;" @click="onAccuseBlogComment(0, this.$route.params.blogid)">
              <svg t="1699605851229" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6120" width="20" height="20"><path d="M512 64c17.673 0 32 14.327 32 32v56c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32V96c0-17.673 14.327-32 32-32zM732.751 103.84c16.268 6.905 23.858 25.69 16.953 41.959l-21.881 51.548c-6.906 16.268-25.691 23.858-41.96 16.953-16.268-6.905-23.858-25.691-16.952-41.96l21.88-51.548c6.906-16.268 25.692-23.858 41.96-16.953zM920.601 224.55c12.497 12.496 12.497 32.758 0 45.254l-39.598 39.598c-12.497 12.497-32.758 12.497-45.255 0-12.496-12.496-12.496-32.758 0-45.254l39.598-39.598c12.497-12.497 32.758-12.497 45.255 0zM109.55 239.399c12.496-12.497 32.758-12.497 45.254 0l39.598 39.598c12.497 12.497 12.497 32.758 0 45.255-12.496 12.496-32.758 12.496-45.254 0l-39.598-39.598c-12.497-12.497-12.497-32.758 0-45.255zM293.815 111.475c16.386-6.62 35.037 1.296 41.657 17.682l20.978 51.923c6.62 16.386-1.296 35.037-17.682 41.657-16.387 6.62-35.037-1.296-41.658-17.682l-20.978-51.923c-6.62-16.386 1.297-35.037 17.683-41.657z" fill="#d81e06" p-id="6121"></path><path d="M512.5 213C349.852 213 218 344.852 218 507.5V896h589V507.5C807 344.852 675.148 213 512.5 213z m3.812 64.03C641.855 279.067 743 381.472 743 507.5V832H282V507.5C282 380.198 385.198 277 512.5 277l3.812 0.03z" fill="#d81e06" p-id="6122"></path><path d="M130 832h766v64H130z" fill="#d81e06" p-id="6123"></path><path d="M482.166 373.81l60.668 20.38L492.507 544h127.781l-77.406 234.048-60.764-20.096L531.711 608H403.493z" fill="#d81e06" p-id="6124"></path></svg>举报
            </span>

            <span style="float:right;margin:10px;font-size: 18px;cursor:pointer;" @click="likeBlog">
              <svg v-if="!blogContent.likeStatus" t="1699104863182" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5695" width="22" height="22">
                <!-- 未点赞状态svg -->
                <path
                  d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667z"
                  fill="#dbdbdb" p-id="5696"></path>
              </svg>
              <svg v-else t="1699104863182" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5695" width="22" height="22">
                <path
                  d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667z"
                  fill="#d81e06" p-id="5696"></path>
              </svg>点赞
            </span>
            <span style="float:right;margin:10px;font-size: 18px;cursor:pointer;" @click="oncollectBlog">
              <!-- 未收藏状态 -->
              <svg v-if="!blogContent.collectedStatus" t="1699104717844" class="icon" viewBox="0 0 1024 1024"
                version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4569" width="22" height="22">
                <path
                  d="M284.458667 941.397333c-36.437333 15.637333-68.48-7.68-64.896-47.168l22.613333-248.917333-164.394667-188.053333c-26.069333-29.824-13.653333-67.562667 24.789334-76.309334l243.370666-55.381333 127.786667-214.677333c20.288-34.090667 59.946667-34.069333 80.213333 0l127.786667 214.677333 243.370667 55.381333c38.656 8.789333 50.858667 46.485333 24.789333 76.309334l-164.394667 188.053333 22.741334 249.002667c3.605333 39.509333-28.458667 62.805333-64.896 47.146666l-229.504-98.517333-229.376 98.453333z"
                  fill="#e6e6e6" p-id="4570"></path>
              </svg>
              <svg v-else t="1699099263139" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="4011" width="22" height="22">
                <path
                  d="M284.458667 941.397333c-36.437333 15.637333-68.48-7.68-64.896-47.168l22.613333-248.917333-164.394667-188.053333c-26.069333-29.824-13.653333-67.562667 24.789334-76.309334l243.370666-55.381333 127.786667-214.677333c20.288-34.090667 59.946667-34.069333 80.213333 0l127.786667 214.677333 243.370667 55.381333c38.656 8.789333 50.858667 46.485333 24.789333 76.309334l-164.394667 188.053333 22.741334 249.002667c3.605333 39.509333-28.458667 62.805333-64.896 47.146666l-229.504-98.517333-229.376 98.453333z"
                  fill="#d81e06" p-id="4012"></path>
              </svg>收藏
            </span>
          </div>
        </el-footer>

        <!-- 评论区 -->
        <el-container
          style="background-color: rgb(255, 255, 255);margin: 20px 10px;border:2px solid rgb(255, 255, 255);border-radius: 20px;display:flex;flex-direction: column;">
          <h1 style="font-size: 20px;padding:0 10px;">评论({{ blogContent.commentNum }})</h1>
          <div>
            <div><span style="font-size: 18px;padding:0 10px;font-weight: 800;">我的评论</span>
              <span style="float: right;margin:10px;font-size: 16px;">{{ myData.nickname }}</span>
              <el-avatar :size="30" :src="myData.myIcon" style="float: right;" />
            </div>
            <el-input v-model="mycomment" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"
              placeholder="平等表达，友好交流~" />

            <el-button type="primary" round color="#666" style="margin: 15px;float:right;padding:20px;font-size: 20px;"
              @click="submitMyComment">发表评论</el-button>
          </div>

          <el-main>

            <div>
              <h1 style="text-align: left;margin-left: 10px;font-size: 17px;">共{{ blogContent.commentNum }}条回复：
                <el-pagination v-model:current-page="currentPageComment" :small="false" :disabled="false"
                  :background="true" layout="prev, pager, next, jumper" :total="totalItemComment"
                  @current-change="handleCurrentChangeComment" style="float: right;margin-right: 30px;" />
              </h1>
            </div>
            <div style="display: flex;flex-direction: column;" v-for="(commenti, index) in commentData.records">
              <div>
                <el-avatar :src="commenti.userAvatar" style="float:left;cursor:pointer;"
                  @click="touser(commenti.userId)" /><span
                  style="font-size: 16px;font-weight: 800;padding:8px 18px;display:flex;justify-content: center;float:left;cursor:pointer;"
                  @click="touser(commenti.userId)">{{
                    commenti.userNickname }}</span>
                    <span style="float:right;margin:0px;font-size: 18px;cursor:pointer;" @click="onAccuseBlogComment(1, commenti.id)">
                      <svg t="1699605851229" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6120" width="20" height="20"><path d="M512 64c17.673 0 32 14.327 32 32v56c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32V96c0-17.673 14.327-32 32-32zM732.751 103.84c16.268 6.905 23.858 25.69 16.953 41.959l-21.881 51.548c-6.906 16.268-25.691 23.858-41.96 16.953-16.268-6.905-23.858-25.691-16.952-41.96l21.88-51.548c6.906-16.268 25.692-23.858 41.96-16.953zM920.601 224.55c12.497 12.496 12.497 32.758 0 45.254l-39.598 39.598c-12.497 12.497-32.758 12.497-45.255 0-12.496-12.496-12.496-32.758 0-45.254l39.598-39.598c12.497-12.497 32.758-12.497 45.255 0zM109.55 239.399c12.496-12.497 32.758-12.497 45.254 0l39.598 39.598c12.497 12.497 12.497 32.758 0 45.255-12.496 12.496-32.758 12.496-45.254 0l-39.598-39.598c-12.497-12.497-12.497-32.758 0-45.255zM293.815 111.475c16.386-6.62 35.037 1.296 41.657 17.682l20.978 51.923c6.62 16.386-1.296 35.037-17.682 41.657-16.387 6.62-35.037-1.296-41.658-17.682l-20.978-51.923c-6.62-16.386 1.297-35.037 17.683-41.657z" fill="#d81e06" p-id="6121"></path><path d="M512.5 213C349.852 213 218 344.852 218 507.5V896h589V507.5C807 344.852 675.148 213 512.5 213z m3.812 64.03C641.855 279.067 743 381.472 743 507.5V832H282V507.5C282 380.198 385.198 277 512.5 277l3.812 0.03z" fill="#d81e06" p-id="6122"></path><path d="M130 832h766v64H130z" fill="#d81e06" p-id="6123"></path><path d="M482.166 373.81l60.668 20.38L492.507 544h127.781l-77.406 234.048-60.764-20.096L531.711 608H403.493z" fill="#d81e06" p-id="6124"></path></svg>举报
                    </span>
                <span style="float:right;font-size: 16px;margin:0 10px;"
                  @click="likeComment(commenti.id, commenti.likeStatus, index)">点赞:
                  <span>
                    <span style="cursor: pointer;">
                      <svg v-if="commenti.likeStatus" t="1699015306745" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5072" width="20" height="20">
                        <path
                          d="M510.671749 348.792894S340.102978 48.827055 134.243447 254.685563C-97.636714 486.565724 510.671749 913.435858 510.671749 913.435858s616.107079-419.070494 376.428301-658.749272c-194.095603-194.096626-376.428302 94.106308-376.428301 94.106308z"
                          fill="#FF713C" p-id="5073"></path>
                        <path
                          d="M510.666632 929.674705c-3.267417 0-6.534833-0.983397-9.326413-2.950192-16.924461-11.872399-414.71121-293.557896-435.220312-529.448394-5.170766-59.482743 13.879102-111.319341 56.643068-154.075121 51.043536-51.043536 104.911398-76.930113 160.095231-76.930114 112.524796 0 196.878996 106.48115 228.475622 153.195078 33.611515-45.214784 122.406864-148.20646 234.04343-148.20646 53.930283 0 105.46603 24.205285 153.210428 71.941496 45.063335 45.063335 64.954361 99.200326 59.133795 160.920016C935.306982 641.685641 536.758893 915.327952 519.80271 926.859589a16.205077 16.205077 0 0 1-9.136078 2.815116zM282.857183 198.75574c-46.25344 0-92.396363 22.682605-137.127124 67.413365-36.149315 36.157501-51.614541 78.120218-47.25321 128.291898 17.575284 202.089671 352.199481 455.119525 412.332023 499.049037 60.434417-42.86732 395.406538-289.147446 414.567947-492.458945 4.933359-52.344159-11.341303-96.465029-49.759288-134.88199-41.431621-41.423435-85.24243-62.424748-130.242319-62.424748-122.041544 0-220.005716 152.203494-220.989114 153.742547-3.045359 4.806469-8.53335 7.883551-14.101159 7.534603a16.257266 16.257266 0 0 1-13.736863-8.184403c-0.902556-1.587148-91.569532-158.081365-213.690893-158.081364z"
                          fill="#885F44" p-id="5074"></path>
                      </svg>
                      <svg v-else t="1699015306745" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5072" width="20" height="20">
                        <path
                          d="M510.671749 348.792894S340.102978 48.827055 134.243447 254.685563C-97.636714 486.565724 510.671749 913.435858 510.671749 913.435858s616.107079-419.070494 376.428301-658.749272c-194.095603-194.096626-376.428302 94.106308-376.428301 94.106308z"
                          fill="#fff" p-id="5073"></path>
                        <path
                          d="M510.666632 929.674705c-3.267417 0-6.534833-0.983397-9.326413-2.950192-16.924461-11.872399-414.71121-293.557896-435.220312-529.448394-5.170766-59.482743 13.879102-111.319341 56.643068-154.075121 51.043536-51.043536 104.911398-76.930113 160.095231-76.930114 112.524796 0 196.878996 106.48115 228.475622 153.195078 33.611515-45.214784 122.406864-148.20646 234.04343-148.20646 53.930283 0 105.46603 24.205285 153.210428 71.941496 45.063335 45.063335 64.954361 99.200326 59.133795 160.920016C935.306982 641.685641 536.758893 915.327952 519.80271 926.859589a16.205077 16.205077 0 0 1-9.136078 2.815116zM282.857183 198.75574c-46.25344 0-92.396363 22.682605-137.127124 67.413365-36.149315 36.157501-51.614541 78.120218-47.25321 128.291898 17.575284 202.089671 352.199481 455.119525 412.332023 499.049037 60.434417-42.86732 395.406538-289.147446 414.567947-492.458945 4.933359-52.344159-11.341303-96.465029-49.759288-134.88199-41.431621-41.423435-85.24243-62.424748-130.242319-62.424748-122.041544 0-220.005716 152.203494-220.989114 153.742547-3.045359 4.806469-8.53335 7.883551-14.101159 7.534603a16.257266 16.257266 0 0 1-13.736863-8.184403c-0.902556-1.587148-91.569532-158.081365-213.690893-158.081364z"
                          fill="#885F44" p-id="5074"></path>
                      </svg>
                      <span style="margin:5px;">
                        {{ commenti.likeNum }}</span>
                    </span>
                  </span>
                </span>
                <span style="float:right;margin:0 20px;font-size: 12px;">{{ commenti.createTime }}</span>
              </div>
              <div style="margin: 20px;font-size: 18px;font-weight: 600;">{{ commenti.content }}</div>
              <div>
                <span style="margin: 20px;font-size: 15px;cursor:pointer;" @click="reply(index)">回复</span>
                <div style="margin:18px;font-size: 14px;background-color: #eff6fd;border-radius: 8px;padding:12px;"
                  v-show='commenti.replyStatus'>
                  <el-input v-model="mycommentReply" :autosize="{ minRows: 2, maxRows: 8 }" type="textarea"
                    placeholder="和平交流，共同进步~" />
                  <div style="padding: 14px 0;">
                    <!-- 想在这插入emoji -->
                    <span style="cursor: pointer;" @click="touser(myData.userId)"><el-avatar :src="myData.myIcon"
                        :size="30" />{{ myData.nickname }}</span>
                    <span style="float:right;">
                      <el-button type="primary" plain>清空</el-button>
                      <el-button type="primary" @click="onsSubmitReply(commenti.id, commenti.id)">发送</el-button></span>
                  </div>
                </div>
                <span style="cursor: pointer;margin-left: 20px;color:#1989fa;font-size: 15px;"
                  v-if="commenti.listCommentStatus" @click="listResponse(commenti.id, index)">展开评论</span>
                <span v-else>
                  <span @click="listResponse(commenti.id, index)" style="cursor: pointer;">收起评论</span>
                  <div style="margin:18px;font-size: 14px;background-color: #eff6fd;border-radius: 8px;padding:12px;">
                    <div v-if="commenti.childComments.total == 0" style="text-align: center;">没有回复哦</div>
                    <div v-else style="display: flex;flex-direction: column;"
                      v-for="(commentj, indexj) in commenti.childComments.records">
                      <div>
                        <div>
                          <span>
                            <el-avatar :src="commentj.userAvatar" style="float:left;cursor:pointer;"
                              @click="touser(commentj.userId)" />
                            <span
                              style="font-size: 16px;font-weight: 800;padding:8px 10px;display:flex;justify-content: center;float:left;cursor:pointer;"
                              @click="touser(commentj.userId)">{{ commentj.userNickname }}
                            </span>
                          </span>
                          <span
                            style="float:left;margin:0px 16px;font-size: large;line-height: 2;color:rgb(101, 115, 186)">回复@</span>
                          <span>
                            <span
                              style="font-size: 16px;font-weight: 800;padding:8px 18px;display:flex;justify-content: center;float:left;cursor:pointer;color:rgb(250, 0, 0);"
                              @click="touser(commentj.replayUserId)">{{ commentj.replyUsername }}</span>
                          </span>

                        </div>

                        <span style="float:right;font-size: 16px;margin:0 10px;"
                          @click="likeComment(commentj.id, commentj.likeStatus, index)">点赞:
                          <span>
                            <span style="cursor: pointer;">
                              <svg v-if="commentj.likeStatus" t="1699015306745" class="icon" viewBox="0 0 1024 1024"
                                version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5072" width="20" height="20">
                                <path
                                  d="M510.671749 348.792894S340.102978 48.827055 134.243447 254.685563C-97.636714 486.565724 510.671749 913.435858 510.671749 913.435858s616.107079-419.070494 376.428301-658.749272c-194.095603-194.096626-376.428302 94.106308-376.428301 94.106308z"
                                  fill="#FF713C" p-id="5073"></path>
                                <path
                                  d="M510.666632 929.674705c-3.267417 0-6.534833-0.983397-9.326413-2.950192-16.924461-11.872399-414.71121-293.557896-435.220312-529.448394-5.170766-59.482743 13.879102-111.319341 56.643068-154.075121 51.043536-51.043536 104.911398-76.930113 160.095231-76.930114 112.524796 0 196.878996 106.48115 228.475622 153.195078 33.611515-45.214784 122.406864-148.20646 234.04343-148.20646 53.930283 0 105.46603 24.205285 153.210428 71.941496 45.063335 45.063335 64.954361 99.200326 59.133795 160.920016C935.306982 641.685641 536.758893 915.327952 519.80271 926.859589a16.205077 16.205077 0 0 1-9.136078 2.815116zM282.857183 198.75574c-46.25344 0-92.396363 22.682605-137.127124 67.413365-36.149315 36.157501-51.614541 78.120218-47.25321 128.291898 17.575284 202.089671 352.199481 455.119525 412.332023 499.049037 60.434417-42.86732 395.406538-289.147446 414.567947-492.458945 4.933359-52.344159-11.341303-96.465029-49.759288-134.88199-41.431621-41.423435-85.24243-62.424748-130.242319-62.424748-122.041544 0-220.005716 152.203494-220.989114 153.742547-3.045359 4.806469-8.53335 7.883551-14.101159 7.534603a16.257266 16.257266 0 0 1-13.736863-8.184403c-0.902556-1.587148-91.569532-158.081365-213.690893-158.081364z"
                                  fill="#885F44" p-id="5074"></path>
                              </svg>
                              <svg v-else t="1699015306745" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="5072" width="20" height="20">
                                <path
                                  d="M510.671749 348.792894S340.102978 48.827055 134.243447 254.685563C-97.636714 486.565724 510.671749 913.435858 510.671749 913.435858s616.107079-419.070494 376.428301-658.749272c-194.095603-194.096626-376.428302 94.106308-376.428301 94.106308z"
                                  fill="#fff" p-id="5073"></path>
                                <path
                                  d="M510.666632 929.674705c-3.267417 0-6.534833-0.983397-9.326413-2.950192-16.924461-11.872399-414.71121-293.557896-435.220312-529.448394-5.170766-59.482743 13.879102-111.319341 56.643068-154.075121 51.043536-51.043536 104.911398-76.930113 160.095231-76.930114 112.524796 0 196.878996 106.48115 228.475622 153.195078 33.611515-45.214784 122.406864-148.20646 234.04343-148.20646 53.930283 0 105.46603 24.205285 153.210428 71.941496 45.063335 45.063335 64.954361 99.200326 59.133795 160.920016C935.306982 641.685641 536.758893 915.327952 519.80271 926.859589a16.205077 16.205077 0 0 1-9.136078 2.815116zM282.857183 198.75574c-46.25344 0-92.396363 22.682605-137.127124 67.413365-36.149315 36.157501-51.614541 78.120218-47.25321 128.291898 17.575284 202.089671 352.199481 455.119525 412.332023 499.049037 60.434417-42.86732 395.406538-289.147446 414.567947-492.458945 4.933359-52.344159-11.341303-96.465029-49.759288-134.88199-41.431621-41.423435-85.24243-62.424748-130.242319-62.424748-122.041544 0-220.005716 152.203494-220.989114 153.742547-3.045359 4.806469-8.53335 7.883551-14.101159 7.534603a16.257266 16.257266 0 0 1-13.736863-8.184403c-0.902556-1.587148-91.569532-158.081365-213.690893-158.081364z"
                                  fill="#885F44" p-id="5074"></path>
                              </svg>
                              <span style="margin:5px;">
                                {{ commentj.likeNum }}</span>
                            </span>
                          </span>
                        </span>
                        <span style="float:right;margin:0 20px;font-size: 12px;">{{ commentj.createTime }}</span>
                      </div>
                      <div style="margin: 20px;font-size: 18px;font-weight: 600;">{{ commentj.content }}</div>
                      <div>
                        <span style="margin: 20px;font-size: 15px;cursor:pointer;"
                          @click="reply2(index, indexj)">回复</span>
                        <div
                          style="margin:18px;font-size: 14px;background-color: #eff6fd;border-radius: 8px;padding:12px;"
                          v-show='commentj.replyStatus'>
                          <el-input v-model="mycommentReply" :autosize="{ minRows: 2, maxRows: 8 }" type="textarea"
                            placeholder="和平交流，共同进步~" />
                          <div style="padding: 14px 0;">
                            <!-- 想在这插入emoji -->
                            <span style="cursor: pointer;" @click="touser(myData.userId)"><el-avatar :src="myData.myIcon"
                                :size="30" />{{ myData.nickname }}</span>
                            <span style="float:right;">
                              <el-button type="primary" plain>清空</el-button>
                              <el-button type="primary"
                                @click="onsSubmitReply(commentj.id, commenti.id)">发送</el-button></span>
                          </div>
                        </div>
                      </div>
                      <el-divider></el-divider>
                    </div>
                  </div>
                </span>
              </div>
              <el-divider></el-divider>
            </div>
          </el-main>
        </el-container>
      </el-container>
      <el-aside width="320px" style="margin:20px;">
        <el-card style="margin-top: 40px;align-items: center;text-align: center;">
          <el-avatar :src="autherForm.iconUrl" @click="toUser" style="cursor:pointer;" />
          <div>
            <span style="padding: 18px;cursor:pointer;font-size: 20px;" @click="toUser">{{ autherForm.nickname }}</span>
            <div style="justify-content: space-between;text-align: center;">
              {{ autherForm.intro ? autherForm.intro : "这个人很懒，暂时没有简介哦。" }}
            </div>
          </div>
          <div>
            <el-tag style="cursor:pointer;" v-for="item in this.autherForm.label" @click="toTag(item)">{{ item }}</el-tag>
          </div>
          <div style="margin-top: 12px;">
            <el-button type="primary" @click="toFollowing">关注</el-button>
            <el-button @click="toFollowers">粉丝</el-button>
          </div>
        </el-card>

        <el-card style="margin-top:40px;background-color: rgb(247, 239, 231);">
          <span style="font-size: 16px;color:rgb(253, 84, 135);"><ins>本文附件文件下载：</ins></span>
          <div v-if="blogContent.files.length == 0" style="font-size: 16px;margin-left: 20px;">暂无附件QAQ</div>
          <div v-for="fi in blogContent.files" title="点击下载附件" class="filesi"><el-icon>
              <Document />
            </el-icon>{{ fi.filename }}</div>
        </el-card>
      </el-aside>
    </el-container>
  </div>

  <el-backtop :bottom="100" :right="80">
    <div style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      ">
      UP
    </div>
  </el-backtop>
  <el-drawer v-model="collectDrawer" title="请选择收藏夹" direction="btt" style="font-size: 20px;height:fit-content;">
    <div v-for="(item,index) in myCollectionList" style="text-align: left;margin: 20px 100px;">
      <div>
        <span style="font-size: large;cursor:pointer;">{{ item.name }}</span>
        <span @click="selectCollection(index, item.id, item.name, item.include)"
          style="float: right;font-size: 16px;color:rgb(101, 155, 247);cursor:pointer;">
          <span>
            <svg v-if="item.include" t="1699598526860" class="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="4524" width="20" height="20">
              <path
                d="M929.344 204.8H478.656C468.8 204.8 460.8 196.8 460.8 186.944v-34.752C460.8 100.16 418.24 57.6 366.144 57.6H94.656C42.56 57.6 0 100.16 0 152.256v777.152C0 981.44 42.56 1024 94.656 1024h834.752c52.032 0 94.656-42.56 94.656-94.656V299.456C1024 247.36 981.44 204.8 929.344 204.8zM602.24 757.568l-85.12-44.8c-5.184-2.752-11.392-2.752-16.64 0l-85.12 44.8c-13.056 6.912-28.352-4.224-25.856-18.816l16.256-94.848a17.92 17.92 0 0 0-5.12-15.808L333.504 562.752c-10.88-10.624-4.352-29.184 10.816-30.528l91.456-8.32c6.336-0.576 11.904-4.48 14.528-10.24l42.24-90.688c6.4-13.76 25.92-13.76 32.32 0l42.24 90.688c2.688 5.76 8.256 9.664 14.528 10.24l91.456 8.32c15.168 1.408 21.76 19.904 10.816 30.528L617.024 628.16c-4.224 4.096-6.144 9.984-5.12 15.808l16.256 94.848c2.496 14.528-12.8 25.664-25.92 18.752z"
                fill="#f4ea2a" p-id="4525"></path>
            </svg>
            <svg v-else t="1699598526860" class="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="4524" width="20" height="20">
              <path
                d="M929.344 204.8H478.656C468.8 204.8 460.8 196.8 460.8 186.944v-34.752C460.8 100.16 418.24 57.6 366.144 57.6H94.656C42.56 57.6 0 100.16 0 152.256v777.152C0 981.44 42.56 1024 94.656 1024h834.752c52.032 0 94.656-42.56 94.656-94.656V299.456C1024 247.36 981.44 204.8 929.344 204.8zM602.24 757.568l-85.12-44.8c-5.184-2.752-11.392-2.752-16.64 0l-85.12 44.8c-13.056 6.912-28.352-4.224-25.856-18.816l16.256-94.848a17.92 17.92 0 0 0-5.12-15.808L333.504 562.752c-10.88-10.624-4.352-29.184 10.816-30.528l91.456-8.32c6.336-0.576 11.904-4.48 14.528-10.24l42.24-90.688c6.4-13.76 25.92-13.76 32.32 0l42.24 90.688c2.688 5.76 8.256 9.664 14.528 10.24l91.456 8.32c15.168 1.408 21.76 19.904 10.816 30.528L617.024 628.16c-4.224 4.096-6.144 9.984-5.12 15.808l16.256 94.848c2.496 14.528-12.8 25.664-25.92 18.752z"
                fill="#bfbfbf" p-id="4525"></path>
            </svg>
            收藏
          </span>
        </span>
      </div>
      <div style="font-size: 15px;padding:8px 0;"><span style="cursor:pointer;">{{ item.size }}篇文章</span>
      </div>
    </div>
  </el-drawer>

  <el-dialog v-model="dialogBuildAccuseVisible" title="填写举报信息">
    <el-form :model="accuseForm">
      <el-form-item prop:content label="举报内容">
        <el-input type="textarea" v-model="accuseForm.content" placeholder="请填写举报内容(必填)" />
      </el-form-item>
      <el-form-item prop:brief label="举报类型">
        <el-radio-group v-model="accuseForm.brief">
          <el-radio label="色情低俗" />
          <el-radio label="不实信息" />
          <el-radio label="违禁" />
          <el-radio label="人身攻击" />
          <el-radio label="赌博诈骗" />
          <el-radio label="作者头像/签名/昵称违规" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogBuildAccuseVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmitAccuse">
          确认举报
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style>
.filesi {
  cursor: pointer;
  margin: 10px;
  background-color: #b9e4fc;
  border-radius: 8px;
  border: 1px solid white;
  font-size: 17px;
  padding: 2px 8px;
  width: fit-content;
}

.filesi:hover {
  color: rgb(60, 187, 55);
}</style>