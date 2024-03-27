<script lang="ts">
import { reactive } from 'vue'
import { ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'
import qs from 'qs'
import CryptoJS from 'crypto-js'


export default {
  name: "regist",
  setup() {
    const ruleForm = {
      name: '',
      email: '',
      pass: '',
      checkPass: '',
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
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'))
      } else if (value !== ruleForm.pass) {
        callback(new Error("两次密码不一致！"))
      } else {
        callback()
      }
    };

    return {
      querySearch,
      active: 1,
      ruleForm,
      formRules: {
        email: [
          { required: true, message: '请输入正确的邮箱地址！', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址！', trigger: ['blur'] },
        ],
        name: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
        ],
        pass: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,9}$/, message: '密码至少需要8位，由字母和数字组成！', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {


    onRegistByEmail() {
      this.$refs["ruleFormRef"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          console.log('error submit!');
          return;
        }
        // 验证通过,请求登录
        this.RegistInByEmail();
      });
    },
    RegistInByEmail() {
      let postdata = {
        "name": this.ruleForm.name,
        "email": this.ruleForm.email,
        "password": this.ruleForm.pass,
      }

      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: postdata,
        url: 'https://pd54419854.imdo.co/user/register',
      };
      axios(options).then(res => {
        console.log(res);
        if (res.data.code != 0) {
          ElMessage.error(res.data.msg);
        }
        else {
          this.active = 2;  // 到第二步
        }
      })
    },
    getVerifyCode() {
      // 刷新验证码
      this.imgcodeUrl = this.imgcodeUrl + '?' + Math.random();
    },
    resendEmail() {
      this.RegistInByEmail();
    },
    verifyDone() {
      this.$router.push({
        path: '/logReg/login',
      })
    }
  }
}
</script>


<template>
  <div style="position:absolute;width:60%;height:fit-content;left:0; right:0; top:40px; bottom:0;margin:auto;">
    <div style="position:relative;font-size: 550px;z-index: -1;">🥑</div>

    <div class="demo-form">
      <router-link to="/logReg/login">
        <el-button v-show="active == 1 || active == 2">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>返回登录
        </el-button>
      </router-link>
      <router-view />
      <h2>✨欢迎注册</h2>
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="Step 1" description="欢迎注册" />
        <el-step title="Step 2" description="邮件验证" />
        <el-step title="Step 3" description="完成注册" />
      </el-steps>
      <div
        style="display:flex;justify-content: center;align-items: center;background-color: rgba(255, 255, 255, 0.532);border:2px solid green;border-radius: 30px;margin: 0 30px; padding:30px 30px 0 30px;">
        <div v-show="active == 1">
          <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :rules="formRules" status-icon>
            <el-form-item label="输入邮箱：" prop="email">
              <el-autocomplete v-model="ruleForm.email" placeholder="欢迎使用邮箱注册~" clearable :fetch-suggestions="querySearch"
                :trigger-on-focus="false" />
            </el-form-item>
            <el-form-item label="设置用户名：" prop="name">
              <el-input v-model="ruleForm.name" autocomplete="off" placeholder="请设置用户名" />
            </el-form-item>

            <el-form-item label="设置密码：" prop="pass">
              <el-input v-model="ruleForm.pass" type="password" autocomplete="off" show-password placeholder="请设置密码" />
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass">
              <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" show-password
                placeholder="请确认密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round style="height: fit-content;padding:11px;font-size: 15px;font-weight: 800;"
                @click="onRegistByEmail">发送邮箱验证</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="active == 2">
          <el-container>
            <el-main class="step2">
              <p style="font-size: 25px;">成功发送验证邮件，请检查您的邮箱并按照内容提示完成注册！</p>
              <p class="resendInfo" @click="resendEmail">
                <ins>没有收到邮件？点此重新发送</ins>
              </p>
              <el-button type="primary" @click="active = 3">我已验证</el-button>
            </el-main>
          </el-container>
        </div>

        <div v-show="active == 3" class="step3">
          <h1>🥳注册成功!</h1>
          <el-button type="primary" @click="verifyDone">返回登录</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.demo-form {
  background-color: #a5f78c52;
  border-radius: 30px;
  padding: 100px;
  align-self: center;
  margin: 100px 60px;
  color: rgb(11, 11, 11);
  font-size: 20px;
  float: right;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: auto;
}

.demo-form .el-input {
  --el-input-width: 300px;
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

.step2 {
  width: 90%;
  margin-top: 50px;
  padding: 5px 0px;
  text-align: center;
  font-size: 1.8em;
}

.resendInfo {
  font-size: 0.6em;
  color: gray;
  cursor: pointer;
}

.resendInfo:hover {
  color: red;
}

.step3 {
  text-align: center;
  align-items: center;
}
</style>
