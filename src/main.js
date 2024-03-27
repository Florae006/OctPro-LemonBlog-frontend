import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from '@/router'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueCookies from 'vue-cookies'
import VueStar from 'vue-star'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

axios.defaults.withCredentials = true;

library.add(fas);

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('VueStar', VueStar);
app.component('font-awesome-icon', FontAwesomeIcon);

app.config.globalProperties.$api = axios;
app.config.globalProperties.$cookies = VueCookies;
app.use(router);
app.use(ElementPlus);
app.mount('#app');
