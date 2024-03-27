<script lang="ts">
import axios from 'axios';
import { ElMessage, ElMessageBox, ElNotification, FormInstance, FormRules, UploadProps } from 'element-plus';
import { h, reactive, ref } from 'vue';


export default {
  data() {
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

      nickname: authStr.myInfo.nickname,
      sex: authStr.myInfo.sex,
      birthday: authStr.myInfo.birthday,
      intro: authStr.myInfo.intro,
      profession: authStr.myInfo.profession,
      label: authStr.myInfo.label,
    };
    return {
      authStr, userform,
      activeName: 'basicInfo',
    }
  },
  setup() {
    const allTagLabels = [
      { name: '我的信息', rter: 'basicInfo' },
      { name: '内容管理', rter: 'myBlogs' },
      { name: '我的关注', rter: 'myfollowings' },
      { name: '我的粉丝', rter: 'myfollowers' },
      { name: '我的账户', rter: 'myAccount' },
      { name: '标签管理', rter: 'myLabels' },
    ];
    const authStr = {
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      myInfo: JSON.parse(localStorage.getItem('myInfo') || '{}'),
      rawemail: localStorage.getItem('rawemail'),
    };
    interface RuleForm {
      nickname: string
      name: string,
      rawemail: any
      newemail: string
      email: string
      qq: string
      iconUrl: any
      sex: string
      birthday: Date
      intro: boolean
      label: string[]
      profession: string

      password: string
      newpassword1: string
      newpassword2: string
      newpassword3: string
    };

    const formSize = ref('default')
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<RuleForm>({
      rawemail: authStr.rawemail,
      newemail: '',
      name: '',
      password: '',
      newpassword1: '',
      newpassword2: '',
      newpassword3: '',

      nickname: authStr.myInfo.nickname,
      email: authStr.myInfo.email,
      qq: authStr.myInfo.qq,
      iconUrl: localStorage.getItem('userIcon'),

      sex: authStr.myInfo.sex ? authStr.myInfo.sex : '男',
      birthday: authStr.myInfo.birthday ? authStr.myInfo.birthday : '2000-1-1',
      intro: authStr.myInfo.intro ? authStr.myInfo.intro : '这个人很懒，什么都没有写。',
      profession: authStr.myInfo.profession ? authStr.myInfo.profession : '暂无',
      label: authStr.myInfo.label ? authStr.myInfo.label : [],
    });
    const myBlogList = ref([] as any[]);

    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'))
      } else if (value !== ruleForm.newpassword2) {
        callback(new Error("两次密码不一致！"))
      } else {
        callback()
      }
    };

    const rules = reactive<FormRules<RuleForm>>({
      rawemail: [
        { type: 'string', required: true, message: '请输入邮箱地址！', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址！', trigger: ['blur'] },
      ],
      newemail: [
        { type: 'string', required: true, message: '请输入邮箱地址！', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址！', trigger: ['blur'] },
      ],
      name: [
        { required: true, message: '用户名不能为空！', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '密码不能为空！', trigger: 'blur' },
        { pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,12}$/, message: '密码至少需要8位，由字母和数字组成！', trigger: 'blur' }
      ],
      newpassword1: [
        { required: true, message: '密码不能为空！', trigger: 'blur' },
        { pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,12}$/, message: '密码至少需要8位，由字母和数字组成！', trigger: 'blur' }
      ],
      newpassword2: [
        { required: true, message: '密码不能为空！', trigger: 'blur' },
        { pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,12}$/, message: '密码至少需要8位，由字母和数字组成！', trigger: 'blur' }
      ],
      newpassword3: [
        { required: true, validator: validatePass2, trigger: 'blur' },
      ],
      nickname: [
        { required: true, message: '请设置昵称！', trigger: 'blur' },
        { min: 3, max: 10, message: '昵称长度应该不短于3个字符且不长于10个字符', trigger: 'blur' },
      ],
      email: [
        { required: true, message: '请设置联系邮箱！', trigger: 'change', },
      ],
      qq: [
        { required: true, message: '请设置联系QQ！', trigger: 'change', },
      ],
      sex: [
        { required: true, message: '请设置性别！', trigger: 'change', },
      ],
      birthday: [
        { type: 'date', required: true, message: '请设置生日！', trigger: 'change', },
      ],
      label: [
        { type: 'array', required: true, message: '请选择个人标签', trigger: 'change', },
      ],
      intro: [
        { required: true, message: '请设置个人简介', trigger: 'change', },
        { min: 3, max: 50, message: '个人简介长度应该不短于3个字符且不长于50个字符', trigger: 'blur' },
      ],
    });
    const allLabels = [
      'javascrip', 'java', '前端', '后端', 'php', 'html', 'css', 'golang', 'python', 'matlab', '暂无'
    ];

    const submitForm = () => {
      ElMessageBox.confirm('确定修改吗?').then(() => {
        ruleForm.birthday = new Date(ruleForm.birthday)
        let putdata = {
          "email": ruleForm.email,
          "qq": ruleForm.qq,

          "intro": ruleForm.intro,
          "birthday": ruleForm.birthday.getFullYear() + '-' + (ruleForm.birthday.getMonth() + 1) + '-' + ruleForm.birthday.getDate(),
          "profession": ruleForm.profession,
          "label": ruleForm.label,
          "sex": ruleForm.sex,
          "nickname": ruleForm.nickname,
        }
        // console.log(putdata);

        axios.defaults.headers.common["token"] = localStorage.getItem('token');
        axios.defaults.headers.common["userId"] = localStorage.getItem('userId');
        const options = {
          method: 'PUT',
          headers: { 'content-type': 'application/json; charset=utf-8' },
          params: { userId: localStorage.getItem('userId'), },
          url: `https://pd54419854.imdo.co/userinfo/${localStorage.getItem('userId')}/update`,
          data: putdata,
        };
        axios(options).then((response) => {
          console.log(response.data);
          // localStorage.setItem("myInfo", (JSON.stringify(response.data.data)));
          // location.reload();
          const optioni = {
            method: 'GET',
            headers: { 'content-type': 'application/json; charset=utf-8' },
            params: {
              userId: localStorage.getItem('userId'),
            },
            url: `https://pd54419854.imdo.co/userinfo/${localStorage.getItem('userId')}`,
          };
          axios(optioni).then((response) => {
            localStorage.setItem("myInfo", (JSON.stringify(response.data.data)));
          });
          console.log('submit!');

        });

      })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
    };
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
      response,
      uploadFile
    ) => {
      // console.log(response.data);
      ruleForm.iconUrl = URL.createObjectURL(uploadFile.raw!);
      localStorage.setItem("userIcon", response.data);
      ruleForm.iconUrl = response.data;
    }

    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
      }
      return true
    }
    const uploadIconUrl = `https://pd54419854.imdo.co/userinfo/avatar/${authStr.userId}/update`

    const followingList = [
      { uid: '123', nickname: '迪卢克', iconUrl: 'https://p.qqan.com/up/2021-4/16179407891569608.jpg', intro: '正义人', isfollowed: true },
      { uid: '153', nickname: '凝光', iconUrl: 'https://p.qqan.com/up/2021-4/16179407899447905.jpg', intro: '富婆', isfollowed: true },
      { uid: '125', nickname: '温迪', iconUrl: 'https://p.qqan.com/up/2021-4/16179407901581006.jpg', intro: '酒鬼', isfollowed: false },
    ];
    const followerList = [
      { uid: '443', nickname: '芭芭拉', iconUrl: 'https://p.qqan.com/up/2021-4/16179407897592176.jpg', intro: '孟德偶像', isfollowed: true },
      { uid: '653', nickname: '钟离', iconUrl: 'https://p.qqan.com/up/2021-4/16179407894400236.jpg', intro: '没有摩拉', isfollowed: true },
      { uid: '785', nickname: '达达利亚', iconUrl: 'https://p.qqan.com/up/2021-4/16179407894227064.jpg', intro: '有很多摩拉', isfollowed: false },
    ];
    const getMore = () => {
      // 用来获取更多列表内容
    }
    // 关注列表和粉丝列表
    const load = () => {
      getMore();
    };
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

    // 对话框
    const dialogVisibleEmail = ref(false);
    const dialogVisibleAccount = ref(false);
    const dialogVisiblePassword = ref(false);
    const handleClose = (done: () => void) => {
      ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
          done()
        })
        .catch(() => {
          // catch error
        })

    }

    return {
      myBlogList,
      dialogVisibleEmail, dialogVisibleAccount, dialogVisiblePassword,
      handleClose,
      querySearch,
      load,
      followingList,
      followerList,
      authStr,
      formSize,
      ruleFormRef,
      ruleForm,
      rules,
      allLabels,
      submitForm,
      resetForm,
      handleAvatarSuccess, uploadIconUrl,
      allTagLabels,
    }
  },
  created() {
    if (this.authStr.isloged) {
      axios.defaults.headers.common["token"] = this.authStr.token;

      const options = {
        url: `https://pd54419854.imdo.co/userinfo/${this.authStr.userId}/blog?curPage=1`,
        method: 'GET',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }
      axios(options).then((res) => {
        this.myBlogList = res.data.data.records;
      })
    }
  },
  computed: {
    headerObj() {
      const token = localStorage.getItem('token');
      return {
        token: token
      }
    }
  },
  methods: {
    handleClick(tab: any, event: any) {
      // console.log(tab.props.name, event);
      this.$router.push({
        path: `/creator/${this.authStr.userId}/settings/${tab.props.name}`,
      })
    },
    open1() {
      ElNotification({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '取关成功'),
      })
    },
    open2() {
      ElNotification({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '关注成功'),
      })
    },
    changeFollowed(uid: any, isfollowed: boolean) {
      // 发送改变状态的请求
      if (isfollowed) {
        // 关注转不关注
        this.open1();
      }
      else {
        this.open2();
      }
    },
    toVisit(uid: any) {
      // 跳转主页
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
    onResetEmail() {
      this.$refs["UpdateAccountEmailRef"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          console.log('error submit!');
          return;
        }
        // 验证通过,请求登录
        this.resetEmail();
      });
    },
    resetEmail() {
      // 添加邮箱存在性校验
      const checkdata = {
        email: this.ruleForm.newemail,
      };
      const optionsy = {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        params: checkdata,
        url: `http://127.0.0.1:4523/m1/3409566-0-default/user/email/check`,
      }
      axios(optionsy).then(res => {
        console.log(res);
        if (!res.data.code) {
          ElMessage.error('邮箱已被注册！');
        }
        else {
          const putdata = {
            "originEmail": this.ruleForm.rawemail,
            "newEmail": this.ruleForm.newemail,
            "password": this.ruleForm.password,
          }
          axios.defaults.headers.common["token"] = this.authStr.token;
          axios.defaults.headers.common["userId"] = this.authStr.userId;
          const options = {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            data: putdata,
            url: `http://127.0.0.1:4523/m1/3409566-0-default/user/email/${this.authStr.userId}`,
          };
          axios(options).then(data => {
            console.log(data);
            this.getBasicInfo();
            ElMessage({
              message: '修改邮箱成功😆',
              type: 'success',
            })
          })
        }
      })
    },
    onResetPswd() {
      this.$refs["UpdateAccountPswdRef"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          console.log('error submit!');
          return;
        }
        // 验证通过,请求登录
        this.resetPswd();
      });
    },
    resetPswd() {
      const putdata = {
        "originPassword": this.ruleForm.rawemail,
        "newPassword": this.ruleForm.newpassword2,
      }

      axios.defaults.headers.common["token"] = this.authStr.token;
      axios.defaults.headers.common["userId"] = this.authStr.userId;
      const options = {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        data: putdata,
        url: `http://127.0.0.1:4523/m1/3409566-0-default/user/password/${this.authStr.userId}`,
      };
      axios(options).then(data => {
        // console.log(data);
        this.getBasicInfo();

        ElMessage({
          message: '修改密码成功😆',
          type: 'success',
        })
      })
    },
    onResetName() {
      this.$refs["UpdateAccountNameRef"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          console.log('error submit!');
          return;
        }
        // 验证通过,请求登录
        this.resetName();
      });
    },
    resetName() {
      const putdata = {
        "name": this.ruleForm.name,
      }

      axios.defaults.headers.common["token"] = this.authStr.token;
      axios.defaults.headers.common["userId"] = this.authStr.userId;
      const options = {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        data: putdata,
        url: `http://127.0.0.1:4523/m1/3409566-0-default/user/name/${this.authStr.userId}`,
      };
      axios(options).then(data => {
        console.log(data);
        this.getBasicInfo();
        ElMessage({
          message: '修改账户名成功😆',
          type: 'success',
        })
      })
    },
    getBasicInfo() {
      const optioni = {
        method: 'GET',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        params: {
          userId: this.authStr.userId,
        },
        url: `https://pd54419854.imdo.co/userinfo/${this.authStr.userId}`,
      };
      axios(optioni).then((response) => {
        localStorage.setItem("myInfo", (JSON.stringify(response.data.data)));
      });

      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      axios.defaults.headers.common["userId"] = localStorage.getItem('userId');
      const optionsx = {
        method: 'GET',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: `https://pd54419854.imdo.co/user/email-tip/${localStorage.getItem('userId')}`,
      };
      axios(optionsx).then((response) => {
        localStorage.setItem('rawemail', response.data.data);
      });
    },
  },
}
</script>
<template>
  <div style="background-color: rgb(234, 250, 225); padding:50px 0;margin:0 40px;">
    <h1 style="border-radius:50px;  margin: 20px;height:80px;text-align: center;line-height: 3;">
      {{ userform.nickname }}的个人空间</h1>
    <div class="tabs affix-container">
      <el-affix target=".affix-container" :offset="80">
        <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(labeli) in allTagLabels" :label="labeli.name" :name="labeli.rter">
            <!-- <router-view /> -->
            <div v-if="this.$route.params.settingid == 'basicInfo'">
              <h1>基本信息</h1>
              <div>
                <el-upload class="avatar-uploader" :action="uploadIconUrl" method="put" :headers="headerObj"
                  :show-file-list="false" list-type="picture" name="avatar" :on-success="handleAvatarSuccess">
                  <el-avatar :size="200" v-if="ruleForm.iconUrl" :src="ruleForm.iconUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>

                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" :size="formSize"
                  status-icon>
                  <el-form-item label="昵称：" prop="nickname">
                    <el-input v-model="ruleForm.nickname" show-word-limit maxlength="10" placeholder="请输入昵称" required />
                  </el-form-item>
                  <el-form-item label="设置生日：" required>
                    <el-form-item prop="birthday">
                      <el-date-picker v-model="ruleForm.birthday" type="date" label="选择生日" placeholder="选择生日"
                        style="width: 100%" />
                    </el-form-item>
                  </el-form-item>
                  <el-form-item label="个人标签：" prop="label">
                    <el-checkbox-group v-model="ruleForm.label" :min="1" :max="5">
                      <el-checkbox v-for="labeli in allLabels" :label="labeli" name="type" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="ruleForm.sex">
                      <el-radio label="男" />
                      <el-radio label="女" />
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="个人简介：" prop="intro">
                    <el-input v-model="ruleForm.intro" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm()">
                      确定修改
                    </el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置表单</el-button>
                  </el-form-item>
                </el-form>
              </div>

            </div>

            <div v-else-if="this.$route.params.settingid == 'myBlogs'">
              <h1>我的博客</h1>
              <el-row v-for="(item, index) in myBlogList" :span="24">
                <el-col :key="index">
                  <el-card style="margin:8px;">
                    <template #header>
                      <div style="display:flex;justify-content: space-between;align-items: center;height:18px;">
                        <span style="float:left;font-size: 15px;font-weight: 800;">{{ item.title }}<el-link
                            :underline="false" style="margin-left:13px;"
                            :href="'/editor/' + authStr.userId + '/' + item.blogId">编辑</el-link></span>
                      </div>
                    </template>
                    <div>
                      {{ item.blogBrief }}
                      <div style="display:inline;margin:10px;float:right;">
                        <el-tag v-for="i in item.blogLabels" style="height:18px;font-size: 14px;">{{ i }}</el-tag>
                      </div>
                    </div>
                    <div>

                      <!-- <div style="float:left;">展现量：{{ item.info.views }} | 阅读：{{ item.info.read }} | 评论:{{ item.info.comments }} |
              收藏：{{ item.info.stars }}</div> -->
                    </div>

                  </el-card>
                </el-col>
              </el-row>
            </div>

            <div v-else-if="this.$route.params.settingid == 'myfollowings'">
              <h1>关注列表</h1>
              <el-row v-for="(i, index) in followingList" :span="24" v-infinite-scroll="load" class="infinite-list"
                style="overflow: auto;margin:0 20px;padding:10px 0;">
                <el-col :key="index" class="infinite-list-item">
                  <el-card>
                    <el-avatar :size="80" :src="i.iconUrl" style="float: left;margin:10px ;cursor: pointer;"
                      @click="toVisit(i.uid)" />
                    <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;"
                      @click="toVisit(i.uid)">
                      <span>{{ i.nickname }}</span>
                      <div style="font-size: 15px;">{{ i.intro }}</div>
                    </div>

                    <el-button v-if="i.isfollowed == true" color="#626aef" style="float: right;"
                      @click="changeFollowed(i.uid, i.isfollowed)">已关注</el-button>
                    <el-button v-else="i.isfollowed == false" color="#626aef" style="float: right;"
                      @click="changeFollowed(i.uid, i.isfollowed)" plain>未关注</el-button>
                    <el-button color="#626aef" style="float: right;margin-right: 20px;" plain>私信</el-button>

                  </el-card>
                </el-col>
              </el-row>
            </div>

            <div v-else-if="this.$route.params.settingid == 'myfollowers'">
              <h1>粉丝列表</h1>
              <el-row v-for="(i, index) in followerList" :span="24" v-infinite-scroll="load" class="infinite-list"
                style="overflow: auto;margin:0 20px;padding:10px 0;">
                <el-col :key="index" class="infinite-list-item">
                  <el-card>
                    <el-avatar :size="80" :src="i.iconUrl" style="float: left;margin:10px ;cursor: pointer;"
                      @click="toVisit(i.uid)" />
                    <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;"
                      @click="toVisit(i.uid)">
                      <span>{{ i.nickname }}</span>
                      <div style="font-size: 15px;">{{ i.intro }}</div>
                    </div>

                    <el-button v-if="i.isfollowed == true" color="#626aef" style="float: right;"
                      @click="changeFollowed(i.uid, i.isfollowed)">已回关</el-button>
                    <el-button v-else="i.isfollowed == false" color="#626aef" style="float: right;"
                      @click="changeFollowed(i.uid, i.isfollowed)" plain>未回关</el-button>
                    <el-button color="#626aef" style="float: right;margin-right: 20px;" plain>私信</el-button>

                  </el-card>
                </el-col>
              </el-row>
            </div>

            <div v-else-if="this.$route.params.settingid == 'myAccount'">
              <h1>账户管理</h1>
              <el-descriptions>
                <el-descriptions-item>
                  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" :size="formSize"
                    status-icon>

                    <el-form-item label="账户名：" prop="name">
                      <el-input v-model="ruleForm.name" show-word-limit maxlength="10" placeholder="请输入账户名" required />
                      <el-button @click="dialogVisibleAccount = true">点击修改账户</el-button>
                    </el-form-item>

                    <el-form-item label="登录邮箱：" prop="rawemail">
                      <el-input v-model="ruleForm.rawemail" placeholder="请输入登录邮箱" required />
                      <el-button @click="dialogVisibleEmail = true">点击修改邮箱</el-button>
                    </el-form-item>

                    <el-form-item label="密码：" prop="password">
                      <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" required />
                      <el-button @click="dialogVisiblePassword = true">点击修改密码</el-button>
                    </el-form-item>
                  </el-form>
                </el-descriptions-item>
              </el-descriptions>


              <el-dialog v-model="dialogVisiblePassword" title="密码修改" width="30%" :befor-close="handleClose">
                <el-form ref="UpdateAccountPswdRef" style="width:300px;" :model="ruleForm" :rules="rules" status-icon>
                  <el-form-item label="输入旧密码：" prop="password">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" show-password
                      placeholder="请输入旧密码" />
                  </el-form-item>
                  <el-form-item label="输入新密码：" prop="newpassword2">
                    <el-input v-model="ruleForm.newpassword2" type="password" autocomplete="off" show-password
                      placeholder="请设置新密码" />
                  </el-form-item>
                  <el-form-item label="再次输入新密码：" prop="newpassword3">
                    <el-input v-model="ruleForm.newpassword3" type="password" autocomplete="off" show-password
                      placeholder="再次输入新密码" />
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="resetForm2()">重置信息</el-button>
                    <el-button type="primary" @click="onResetPswd">确认修改</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>

              <el-dialog v-model="dialogVisibleAccount" title="账户修改" width="30%" :befor-close="handleClose">
                <el-form ref="UpdateAccountNameRef" style="width:300px;" :model="ruleForm" :rules="rules"
                  v-show="dialogVisibleAccount" status-icon>
                  <el-form-item label="设置账号名：" prop="name">
                    <el-input v-model="ruleForm.name" autocomplete="off" placeholder="请设置新账号名" />
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="resetForm3()">重置信息</el-button>
                    <el-button type="primary" @click="onResetName">确认修改</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>

              <el-dialog v-model="dialogVisibleEmail" title="邮箱修改" width="30%" :befor-close="handleClose">
                <el-form ref="UpdateAccountEmailRef" style="width:300px;" :model="ruleForm" :rules="rules" status-icon>
                  <el-form-item label="原邮箱：" prop="rawemail">
                    <el-autocomplete v-model="ruleForm.rawemail" placeholder="请输入原邮箱" clearable
                      :fetch-suggestions="querySearch" :trigger-on-focus="false" />
                  </el-form-item>
                  <el-form-item label="新邮箱：" prop="newemail">
                    <el-autocomplete v-model="ruleForm.newemail" placeholder="请输入新邮箱" clearable
                      :fetch-suggestions="querySearch" :trigger-on-focus="false" />
                  </el-form-item>
                  <el-form-item label="输入密码：" prop="newpassword1">
                    <el-input v-model="ruleForm.newpassword1" type="password" autocomplete="off" placeholder="请输入密码" />
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="resetForm1()">重置信息</el-button>
                    <el-button type="primary" @click="onResetEmail">确认修改</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>

              <div>
              </div>
            </div>

            <div v-else-if="this.$route.params.settingid == 'myLabels'">
              <h1>标签列表</h1>
              <el-row v-for="(i, index) in ruleForm.label" :span="24" v-infinite-scroll="load" class="infinite-list"
                style="overflow: auto;margin:0 20px;padding:10px 0;">
                <el-col :key="index" class="infinite-list-item">
                  <el-card>
                    <div style="line-height: 2;font-size: 20px;float:left; margin:10px;cursor: pointer;">
                      <el-avatar shape="square" :size="80">#{{ i }}</el-avatar>
                    </div>

                    <el-button color="#95d475" style="float: right;">已关注</el-button>

                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-affix>

    </div>
  </div>
</template>
<style scoped>
.affix-container {
  background: var(--el-color-primary-light-9);
  border-radius: 80px;
  border: 1px solid #000;
}

.tabs {
  margin: 50px 100px;
  position: relative;
  height: fit-content;
  width: auto;
}

.el-tabs {
  background-color: #EFF6FF;
  color: #000;
  border-radius: 80px;
  left: 0px;
  top: 0px;
  height: 36px;
  line-height: 36px;
  position: relative;
  height: fit-content;
  width: 80%;
  align-self: center;
  padding: 10px 60px;
}

/* 去除灰色横条 */
:deep(.el-tabs__nav-wrap::after) {
  position: static !important;
}

/* 设置滑块颜色 */
:deep(.el-tabs__active-bar) {
  background-color: #538FFF !important;
}

/* 设置滑块停止位置 */
:deep(.el-tabs__active-bar.is-top) {
  height: 37px;
  width: 104px ! important;
  border-radius: 17px;
  top: 0px !important;
  left: -18px !important;
  position: absolute !important;
  z-index: 1;
}

/* 设置当前选中样式 */
:deep(.el-tabs__item.is-active) {
  color: #ffffff !important;
  background-color: #939393;
  z-index: 2;
  border-radius: 20px;
}

/* 设置未被选中样式 */
:deep(.el-tabs__item) {
  padding: 0 20px !important;
  margin: 20px;
  width: 120px;
  box-sizing: border-box;
  display: inline-block;
  position: relative !important;
  color: #000000 !important;
  z-index: 2;
  font-size: 20px;
}</style>