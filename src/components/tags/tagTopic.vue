<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'Topic',
  created() {
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
  data() {
    return {
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
        },
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
        {
          title: '入门 Vue3，我做一款 AI Todo 应用',
          auther: 'windyrain',
          autheruid: '1363050147358206',
          authericon: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          blogid: '7287907117339541544',
          blogtags: ['Vue.js', '前端', 'ChatGPT'],
          blogurl: '',
          blogBrief: '记录一款支持AI生成日报、周报的todo应用——一言清单的诞生过程，路过的朋友们，快来看看吧。',
        },
      ],
    }
  },
}
</script>
<template>
  
</template>