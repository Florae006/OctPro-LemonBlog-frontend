<script lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { h, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage, ElMessageBox, ElNotification, FormInstance, UploadProps, UploadUserFile } from 'element-plus'
import axios from 'axios'

export default {
  components: {
    Editor, Toolbar
  },
  created() {
    if (this.isEdtor) {
      console.log(this.blogid);
      // 发送获取博客内容axios
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const option = {
        url: `https://pd54419854.imdo.co/blog/user/view/${this.$route.params.blogid}`,
        method: 'GET',
      };
      axios(option).then((res) => {
        console.log(res.data);
        this.valueHtml = res.data.data.content;
        this.form.title = res.data.data.title;
        this.form.brief = res.data.data.brief;
        this.form.labels = res.data.data.labels;
        this.form.file = res.data.data.files;
      });
    }
  },
  data() {
    const authStr = {
      isloged: localStorage.getItem('token') && localStorage.getItem('userId') ? true : false,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      myInfo: JSON.parse(localStorage.getItem('myInfo') || '{}'),
    };
    const isEdtor = this.$route.params.blogid ? true : false;
    const btnStatus = ref(true);
    if (isEdtor) {
      btnStatus.value = false
    }
    const blogid = this.$route.params.blogid;
    return {
      btnStatus,
      blogid,
      isEdtor,
      authStr,
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
  setup() {
    // 弹出框设置
    const dialogFormVisible = ref(false);
    const formLabelWidth = '140px';
    const form = reactive({
      title: '',
      brief: '',
      labels: [],
      file: ref([] as any[]),
    })
    const fileList = ref<UploadUserFile[]>([]);

    const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
      ElMessage.success('移除'+file.name+'成功！')
    }

    const handleSuccess: UploadProps['onSuccess'] = (res) => {
      console.log(res);
      if (res.code == 0) {
        ElMessage.success('添加文件' + res.data.filename + '成功！');
        form.file.push(res.data.id)
      }
    }

    const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
      ElMessage.warning(
        `限制上传数量为5个文件，已经有 ${files.length} 个文件了, 将会存在超过 ${files.length + uploadFiles.length
        } 个文件！`
      )
    }

    const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
      return ElMessageBox.confirm(
        `Cancel the transfer of ${uploadFile.name} ?`
      ).then(
        () => true,
        () => false
      )
    }


    const articalLabels = ['前端', '后端', '算法', 'GO', 'Vue', 'React', 'Spring Boot', 'cpp', '机器学习', '人工智能', 'AI', 'Java', 'JavaScript'];
    const uploadFormRef = ref<FormInstance>();
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields();
    }



    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('')

    const toolbarConfig = {};
    const editorConfig = {
      // 某些编辑器配置，如 placeholder
      placeholder: '请输入内容...',

      // 所有的菜单配置，都要在 MENU_CONF 属性下
      MENU_CONF: {
        // 配置字号
        fontSize: [],

        // 配置上传图片
        uploadImage: {},

        // 继续其他菜单配置
        insertImage: {},

        editImage: {},

        // 配置上传视频
        uploadVideo: {},

        codeSelectLang: {},
      }
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor: any) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
      console.log('created', editor);
    }

    const handleChange = (editor: any) => {
      // console.log('change:', editor.children)
    }
    const handleDestroyed = (editor: any) => {
      console.log('destroyed', editor)
    }
    const handleFocus = (editor: any) => {
      console.log('focus', editor)
    }
    const handleBlur = (editor: any) => {
      console.log('blur', editor)
    }
    const customAlert = (info: any, type: any) => {
      alert(`【自定义提示】${type} - ${info}`)
    }
    const customPaste = (editor: any, event: any, callback: any) => {
      console.log('ClipboardEvent 粘贴事件对象', event)
      // const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
      // const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
      // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）

      // 自定义插入内容
      editor.insertText('xxx')

      // 返回 false ，阻止默认粘贴行为
      event.preventDefault()
      callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）

      // 返回 true ，继续默认的粘贴行为
      // callback(true)
    }

    const onsubmitArtical = () => {
      const editor = editorRef.value // 获取 editor ，必须等待它渲染完之后
      if (editor == null) {
        return
      }
      if (editor.getHtml() == '<p><br></p>') {
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: teal' }, '请不要提交空白文档哦😶‍🌫️'),
        });
        return;
      }
      if (editor.getText().length < 20) {
        ElNotification({
          title: '提示',
          message: h('i', { style: 'color: teal' }, '文章内容不要少于20字哦，再多写一些吧😉'),
        });
        return;
      }
      // 设置本文的标签|封面|标题
      dialogFormVisible.value = true;

    }
    const submitArtical = (upd: boolean, blogid?: any) => {
      const editor = editorRef.value;
      const htmlValue = editor.getHtml();
      const sendData = {
        "userId": localStorage.getItem('userId'),
        "title": form.title,
        "content": htmlValue,
        "brief": form.brief,
        "label": form.labels,
        "file": form.file,
      }
      console.log(sendData);
      // 发请求

      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      axios.defaults.headers.common["userId"] = localStorage.getItem('userId');
      if (upd) {
        // 是更新文章请求
        const options = {
          method: 'PUT',
          url: `https://pd54419854.imdo.co/blog/${blogid}/update`,
          headers: { 'content-type': 'application/json' },
          data: sendData
        };
        axios(options).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            ElMessage.success('更新文章成功！')
          }
        })
      }
      else {
        const options = {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          data: sendData,
          url: 'https://pd54419854.imdo.co/blog/submit',
        };
        axios(options).then(res => {
          console.log(res.data);
          if (res.data.code == 0) {
            ElMessage.success('上传文章成功！')
          }
        })
      }
      dialogFormVisible.value = false;
    };


    // 上传图片
    const uploadImg = (file: File, insertFn: any) => {
      // 自定义上传图片
      let imgData = new FormData();
      console.log(file);
      imgData.append("pic", file);
      console.log(imgData)
      // 上传图片请求
      axios.defaults.headers.common["token"] = localStorage.getItem('token');
      const options = {
        url: 'https://pd54419854.imdo.co/blog/pic',
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data' },
        data: { 'pic': file },
      };
      axios(options).then((res) => {
        if (res.data.code == 0) {
          ElMessage.success('成功上传图片！');
          insertFn(res.data.data);
        } else {
          ElMessage.error('上传失败，再试一次吧！');
        }
      })
    };
    const insertImg = (file: File) => {
      //
      console.log(file);
    }
    editorConfig.MENU_CONF['uploadImage'] = {
      customUpload: uploadImg,
      customInsert: insertImg,

      maxFileSize: 4 * 1024 * 1024, // 1M
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 100,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: [],
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      fieldName: "file",

      headers: {
        token: localStorage.getItem('token'),
      },
      // 将 meta 拼接到 url 参数中，默认 false
      metaWithUrl: false,
      // 跨域是否传递 cookie ，默认为 false
      withCredentials: false,
      // 超时时间，默认为 10 秒
      timeout: 5 * 1000, // 5 秒
    }

    editorConfig.MENU_CONF['codeSelectLang'] = {
      // 代码语言
      codeLangs: [
        { text: 'CSS', value: 'css' },
        { text: 'CPP', value: 'cpp' },
        { text: 'PYTHON', value: 'python' },
        { text: 'HTML', value: 'html' },
        { text: 'XML', value: 'xml' },
        // 其他
      ]
    }


    return {
      dialogFormVisible,
      formLabelWidth,
      form, articalLabels,
      uploadFormRef,
      resetForm, submitArtical,
      // 
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      customPaste,
      onsubmitArtical,

      fileList, handleRemove, handleExceed, beforeRemove,handleSuccess,
    };
  },
}
</script>    

<template>
  <el-dialog v-model="dialogFormVisible" >
  <template #title>
    <div style="font-size: 20px;padding:10px 20px;font-weight: 1200;">
      {{ isEdtor?'更新文章':'发布文章' }}
    </div>
  </template>
    <el-form :model="form" ref="uploadFormRef">
      <el-form-item label="设置文章标题：" prop="title" :label-width="formLabelWidth">
        <el-input v-model="form.title" maxlength="20" placeholder="请输入文章标题" show-word-limit type="text"
          autocomplete="off" />
      </el-form-item>
      <el-form-item label="设置文章标签：" prop="labels" :label-width="formLabelWidth">
        <el-checkbox-group v-model="form.labels" :min="1" :max="5">
          <el-checkbox v-for="label in articalLabels" :key="label" :label="label" name="type">{{ label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="设置文章简介：" prop="brief">
        <el-input v-model="form.brief" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入文章简介" />
      </el-form-item>
      <el-form-item label="随文件上传：" prop="files">
        <el-upload v-model:file-list="fileList" class="upload-demo"
          action="https://pd54419854.imdo.co/blog/file" multiple :on-success="handleSuccess" :on-remove="handleRemove" method="PUT" :limit="3" :on-exceed="handleExceed" :headers="headerObj" >
          <el-button type="primary">点击添加附件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              可添加小于 500KB 的jpg/png文件(不超过5个文件).
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(uploadFormRef)">重置信息</el-button>
        <el-button v-if="isEdtor" type="primary" @click="submitArtical(isEdtor,blogid)">
          {{ isEdtor?'更新文章':'上传文章' }}
        </el-button>
        <el-button v-else type="primary" @click="submitArtical(isEdtor)">
          {{ isEdtor?'更新文章':'上传文章' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
    <el-affix :offset="60">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    </el-affix>
  <div style="width:50%;float:left;margin-top:50px;font-size:20px;">

    <Editor style="height:1000px; overflow-y: hidden;margin-top: 28px;" v-model="valueHtml" :defaultConfig="editorConfig"
      :mode="mode" @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed"
      @onFocus="handleFocus" @onBlur="handleBlur" @customAlert="customAlert" @customPaste="customPaste" />

  </div>
  <div v-html="valueHtml" style="width:50%;float:left;white-space:normal; word-break:break-all;overflow:hidden;padding:20px;margin-top:50px;font-size:20px;"></div>

  <el-button type="primary" round @click="onsubmitArtical" plain style="height:50px;width:120px;font-size:20px;font-weight:800;position:fixed;bottom:50px;right:30px;">{{ isEdtor?'更新文章':'上传文章' }}</el-button>
</template>
