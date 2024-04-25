<script lang="ts">
export default {
  name: "login",
  data() {

    const authStr = {
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
      userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
    };
    const ruleFormEmail = {
      nickname: 'momo',
      email: '',
      password: '',
      imgcode: '',
    };
    const ruleFormAccount = {
      name: 'momo',
      account: '',
      password: '',
      imgcode: '',
    };
    const formRules = {
      email: [
        { type: 'string', required: true, message: '请输入正确的邮箱地址！', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址！', trigger: 'blur' },
        { validator: this.validateEmail, required: true, trigger: 'blur' },
      ],
      account: [
        { required: true, message: '账号不能为空！', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '密码不能为空！', trigger: 'blur' },
        { pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,9}$/, message: '密码格式不正确', trigger: 'blur' },
        { validator: this.validatePass, required: true, trigger: ['blur', 'change'] },
      ],
      imgcode: [
        { type: 'string', required: true, message: '验证码不能为空！', trigger: 'blur' },
        { validator: this.validateYzm, required: true, trigger: 'blur' },
      ],
    };
    return {
      show: true,
      count: '',
      timer: null,
      imgcodeUrl: 'https://pd54419854.imdo.co/user/verifyCode',
      logcode: '',

      authStr,
      ruleFormEmail,
      ruleFormAccount,
      checked: true,
      formRules,
    }
  },
  methods: {
    getVerifyCode() {
      // 刷新验证码
      this.imgcodeUrl = this.imgcodeUrl + '?' + Math.random();
    },
    validateEmail(rule: any, value: any, callback: any) {
      console.log(this.logcode)
      if (this.logcode == 1009) {
        // 初始化code没有值，不进判断
        callback(new Error('账号未注册，请先注册后登录！'));
        this.logcode = 0;
        this.getVerifyCode();
      } else {
        callback()
      }
    },
    validatePass(rule: any, value: any, callback: any) {
      if (this.logcode == 2002) {
        // 初始化code没有值，不进判断
        callback(new Error('密码错误！'));
        this.logcode = 0;
        this.getVerifyCode();
      } else {
        callback();
      }
    },
    validateYzm(rule: any, value: any, callback: any) {
      if (this.logcode == 2007) {
        // 初始化code没有值，不进判断
        callback(new Error('验证码错误！'));
        this.logcode = 0;
        this.getVerifyCode();
      } else {
        callback();
      }
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
        if (response.data.code == 0) {
          console.log('登录成功：', response.data);
          localStorage.setItem("myInfo", (JSON.stringify(response.data.data)));
        }
        else {
          ElMessage.error(response.data.msg);
        }
      });

      const optionUrl = {
        method: 'GET',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: `https://pd54419854.imdo.co/userinfo/avatar/${this.authStr.userId}`,
      };
      axios(optionUrl).then((response) => {
        localStorage.setItem("userIcon", response.data.data);
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

      this.$router.replace({
        path: '/'
      })
    },
    onLoginByEmail() {
      this.$refs["ruleFormLogEmail"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          console.log('error submit!');
          return;
        }
        // 验证通过,请求登录
        this.loginInByEmail();
      });
    },
    loginInByEmail() {
      const options = {
        method: "POST",
        url: 'https://pd54419854.imdo.co/user/login',
        data: {
          nickname: this.ruleFormEmail.nickname,
          email: this.ruleFormEmail.email,
          password: this.ruleFormEmail.password,
          verifyCode: this.ruleFormEmail.imgcode,
          
        },
      }
      axios(options).then((response) => {
        console.log(JSON.stringify(response.data));
        this.logcode = response.data.code;
        console.log(this.logcode)

        if (this.logcode == 0) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("userId", response.data.data.userId);
          this.authStr.userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
          // 登录成功发送获得用户基本信息并存入本地
          this.getBasicInfo();
        }
        else if (this.logcode == 1007) {
          // 重复登录
          this.$router.push({
            path: '/'
          });
          console.log('重复登录跳转首页');
        } else {
          ElMessage.error(response.data.msg)
        }

      }).catch((err) => {
        console.log(err);
      })
      console.log('submit!');
    },
    onLoginByAcount() {
      this.$refs["ruleFormLogAccount"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          console.log('error submit!');
          return;
        }
        //验证通过,请求登录
        this.loginInByAcount();
      });
    },
    loginInByAcount() {
      let getdata = {
        "nickname": this.ruleFormAccount.account,
        "password": this.ruleFormAccount.password,
        "verifyCode": this.ruleFormAccount.imgcode,
      };
      console.log(getdata);

      const options = {
        method: 'GET',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        params: getdata,
        url: 'https://pd54419854.imdo.co/user/login',
      };
      axios(options).then(() => { });
      console.log('submit!');
    },
    getPswdBack() {
      // 找回密码
      this.$router.replace({
        path: '/logReg/forgivePswd'
      })
    }
  }
}


</script>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { callbackify } from 'util';
import { ElMessage } from 'element-plus';

const tabName = ref('first');
const yzmshow = ref(true);

const createFilter = (queryString: any) => {
  return (item: any) => {
    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
  };
}
const querySearchEmail = (queryString: any, callback: any) => {
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
</script>

<template>
  <div style="position:absolute;width:60%;height:fit-content;left:0; right:0; top:40px; bottom:0;margin:auto;border-radius: 50px;">
    <div style="position:relative;font-size: 550px;z-index: -1;">🍋</div>

    <div class="demo-form-login">
      <router-link to="/logReg/regist">
        <el-button color="#529b2e" plain>
          前往注册
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </el-button>
      </router-link>
      <router-view />
      <h2>✨欢迎登录</h2>
      <el-tabs class="demo-tabs" v-model="tabName">
        <el-tab-pane label="邮箱登录" name="first">
          <el-form ref="ruleFormLogEmail" :model="ruleFormEmail" :rules="formRules" status-icon>
            <el-form-item label="请输入邮箱：" prop="email">
              <el-autocomplete v-model="ruleFormEmail.email" placeholder="欢迎使用邮箱登录~" :fetch-suggestions="querySearchEmail"
                :trigger-on-focus="false" />
            </el-form-item>
            <el-form-item label="输入密码：" prop="password">
              <el-input v-model="ruleFormEmail.password" style="width: 200px" type="password" autocomplete="off" show-password placeholder="请确认密码" />
            </el-form-item>
            <el-form-item label="图形验证：" prop="imgcode">
              <el-input v-model="ruleFormEmail.imgcode" style="width:120px;" />
              <img style="width:100px;height:30px;" title="点击更换验证码" :src="imgcodeUrl" alt="验证码" class="verification-code"
                @click="getVerifyCode">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onLoginByEmail()">立即登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="账号密码登录" name="second">
          <el-form ref="ruleFormLogAccount" :model="ruleFormAccount" :rules="formRules" status-icon>
            <el-form-item label="请输入账号：" prop="account">
              <el-input v-model="ruleFormAccount.account" style="width: 200px" placeholder="欢迎使用账号登录~" clearable />
            </el-form-item>
            <el-form-item label="输入密码：" prop="password">
              <el-input v-model="ruleFormAccount.password" style="width: 200px" type="password" autocomplete="off" show-password
                placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="图形验证：" prop="imgcode">
              <el-input v-model="ruleFormAccount.imgcode" style="width:120px;" />
              <img style="width:100px;height:30px;" title="点击更换验证码" :src="imgcodeUrl" alt="验证码" class="verification-code"
                @click="getVerifyCode">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onLoginByAcount()">立即登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <span class="forgivePswd" @click="getPswdBack"><ins>忘记密码？点击找回密码</ins></span>
      </el-tabs>
    </div>
  </div>
</template>

<style>
.forgivePswd{
  font-size: 16px;
  cursor:pointer;
}
.forgivePswd:hover{
  color:red;
}

.demo-form-login {
  background-color: hsla(75, 86%, 83%, 0.422);
  border-radius: 30px;
  padding: 100px;
  align-self: center;
  margin: 100px 60px;
  color: green;
  font-size: 20px;
  float: right;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: auto;
}

.demo-form-login .el-input {
  --el-input-width: 200px;
}


.verification-code {
  vertical-align: middle;
  cursor: pointer;
  height: 40%;
  width: 60%;
}

/* 下拉表 */
.hintBox {
  width: 100%;
  max-height: 120px;
  overflow-y: scroll;
  overflow-x: auto;
  position: absolute;
  z-index: 999;
  background-color: #fff;
}

.hintItem {
  margin-top: 2px;
  cursor: pointer;
  margin-left: 45px;
  font-size: 13px;
  color: #898989;
}
</style>