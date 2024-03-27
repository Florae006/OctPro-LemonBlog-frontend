<script lang="ts">
import axios from 'axios';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

export default {
  name: '管理员登录',
  data() {
    interface RuleForm {
      username: string
      password: string
    };

    const ruleFormAdminRef = ref<FormInstance>()
    const ruleFormAdmin = reactive<RuleForm>({
      username: '',
      password: '',
    });
    const rules = reactive<FormRules<RuleForm>>({
      username: [
        { required: true, message: '用户名不可为空！', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不可为空！', trigger: 'blur' }
      ]
    });

    return {
      ruleFormAdminRef,
      ruleFormAdmin, rules
    }
  },
  methods: {
    onlogin() {
      this.$refs["ruleFormAdminRef"].validate((valid: any, err: any) => {
        // 如果表单验证失败， 停止请求提交！
        if (!valid) {
          ElMessage.error('提交失败！');
          return;
        }
        // 验证通过,请求登录
        this.adminLogin();
      });
    },
    adminLogin() {
      const getdata = {
        "name": this.ruleFormAdmin.username,
        "password": this.ruleFormAdmin.password,
      }
      console.log(getdata);

      const options = {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        params: getdata,
        url: 'https://pd54419854.imdo.co/admin/login',
      };
      axios(options).then(res => {
        console.log(res);
        if (res.data.code != 0) {
          ElMessage.error(res.data.msg);
        }
        else{
          console.log(res.data);
          localStorage.setItem('adminToken', res.data.data.token);
          localStorage.setItem('adminUserId', res.data.data.userId);
          
          this.$router.push({
            path: '/admin/welcome'
          })
        }
      })
    },
  }
}
</script>

<template>
  <div
    style="width:400px;position:absolute;height:fit-content;left:0; right:0; top:0px; bottom:0;margin:auto;border: solid 2px #7e7e7d;border-radius: 50px;padding:20px;text-align: center;">

    <h2 style="font-size: 23px;">管理员登录</h2>
    <div style="display:flex;justify-content: center;align-items: center;margin: 0 30px; padding:30px 30px 0 30px;">
      <el-form ref="ruleFormAdminRef" label-width="120px"  :model="ruleFormAdmin" :rules="rules" status-icon>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="ruleFormAdmin.username" placeholder="管理员用户名" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="ruleFormAdmin.password" style="width: 200px" type="password" autocomplete="off" show-password
            placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onlogin">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>