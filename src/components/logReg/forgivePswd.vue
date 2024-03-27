<script lang="ts">
export default {
  name: "regist",
  data() {
    return {
      active: 1,
      imgcodeUrl: 'https://pd54419854.imdo.co/user/verifyCode',
      ruleForm: {
        email: '',
        password: '',
        verifyCode: '',
      },
      formRules: {
        email: [
          { required: true, message: '请输入邮箱地址！', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址！', trigger: ['blur'] },
        ]
      },
      formRules1: {
        email: [
          { required: true, message: '请输入邮箱地址！', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址！', trigger: ['blur'] },
        ],
        verifyCode: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,9}$/, message: '密码至少需要8位，由字母和数字组成！', trigger: 'blur' }
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
          ElMessage.error('提交失败！请检查邮箱是否正确！')
          return;
        }
        // 验证通过,请求登录
        this.getEmail();
      });
    },
    getEmail() {
      let getdata = {
        "email": this.ruleForm.email,
      }

      const options = {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        params: getdata,
        url: 'https://pd54419854.imdo.co/user/email/check',
      };
      console.log(options);
      axios(options).then(res => {
        console.log(res);
        if (res.data.code != 0) {
          ElMessage.error(res.data.msg);
        }
        else {
          this.active = 2;  // 到第二步
          // 发送邮箱验证
          const sendData = {
            email: this.ruleForm.email,
          }
          const option = {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
            params: sendData,
            url: 'https://pd54419854.imdo.co/user/password/verifyCode',
          };
          axios(option).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              ElMessage.success('成功发送邮件！');
            }
            else {
              ElMessage.error(res.data.msg);
            }
          })
        }
      })
    },
    getVerifyCode() {
      // 刷新验证码
      this.imgcodeUrl = this.imgcodeUrl + '?' + Math.random();
    },
    resendEmail() {
      this.getEmail();
    },
    verifyDone() {
      this.$router.push({
        path: '/logReg/login',
      })
    },
    finishJudge() {
      let postdata = {
        "email": this.ruleForm.email,
        "password": this.ruleForm.password,
        "verifyCode": this.ruleForm.verifyCode,
      }

      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: postdata,
        url: 'https://pd54419854.imdo.co/user/password/recovery',
      };
      axios(options).then(res => {
        console.log(res);
        if (res.data.code != 0) {
          ElMessage.error(res.data.msg);
        }
        else {
          this.active = 4;  // 到第四步
        }
      })
    }
  }
}
</script>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'

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


</script>

<template>
  <div style="position:absolute;width:60%;height:fit-content;left:0; right:0; top:40px; bottom:0;margin:auto;">
    <div style="position:relative;font-size: 550px;z-index: -1;">🫐</div>

    <div class="demo-form-fgpsw">
      <router-link to="/logReg/login">
        <el-button v-show="active == 1 || active == 2 || active == 3">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>返回登录
        </el-button>
      </router-link>
      <router-view />
      <h2 style="color:white;">✨找回密码</h2>
      <el-steps :active="active" align-center  finish-status="success" process-status="wait">
        <el-step title="Step 1" description="输入邮箱" />
        <el-step title="Step 2" description="邮箱验证" />
        <el-step title="Step 3" description="设置新密码" />
        <el-step title="Step 4" description="成功找回" />
      </el-steps>
      <div
        style="display:flex;flex-direction: column; justify-content: center;align-items: center;background-color: rgba(255, 255, 255, 0.532);border:2px solid rgb(174, 101, 247);border-radius: 30px;margin: 0 30px; padding:5px 30px 0 30px;margin-top:10px;">
        
        <div v-show="active == 1">
        <h4>请输入验证邮箱</h4>
          <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :rules="formRules" status-icon>
            <el-form-item label="输入邮箱：" prop="email">
              <el-autocomplete v-model="ruleForm.email" placeholder="请输入验证邮箱" clearable :fetch-suggestions="querySearch"
                :trigger-on-focus="false" style="color:white;font-size: large;"/>
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
              <p style="font-size: 22px;">成功发送邮箱验证码，请检查您的邮箱并点击下方按钮完成找回密码验证！</p>
              <p class="resendInfo" @click="resendEmail">
                <ins>没有收到邮件？点此重新发送</ins>
              </p>
              <el-button type="primary" @click="active = 3">我已收到验证码</el-button>
            </el-main>
          </el-container>
        </div>

        <div v-show="active == 3">
        <h3 style="width:100%;text-align: center;">设置新密码</h3>
          <el-form ref="ruleFormRef1" :model="ruleForm" label-width="120px" :rules="formRules1" status-icon>
            <el-form-item label="输入邮箱：" prop="email">
              <el-autocomplete v-model="ruleForm.email" placeholder="请输入邮箱" clearable :fetch-suggestions="querySearch"
                :trigger-on-focus="false" style="color:white;font-size: large;"/>
            </el-form-item>
            <el-form-item label="输入密码：" prop="password">
              <el-input v-model="ruleForm.password" type="password" autocomplete="off" show-password placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="邮箱验证：" prop="verifyCode">
              <el-input v-model="ruleForm.verifyCode" style="width: 140px;" /><el-button type="primary">重新发送</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round style="height: fit-content;padding:11px;font-size: 15px;font-weight: 800;"
                @click="finishJudge">完成设置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-show="active == 4" class="step3" style="padding: 10px;">
          <h1>🥳验证成功!</h1>
          <el-button type="primary" @click="verifyDone">返回登录</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.demo-form-fgpsw {
  background-color: #cb8cf752;
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

.demo-form-fgpsw .el-input {
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
}</style>
