import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const routes = [
  {
    name: '首页',
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        name: '博客分类页面',
        path: 'topic/:tag/',
        component: () => import('@/components/tags/tagTopic.vue'),
      },
    ]
  },
  {
    name: '发布文章',
    path: '/editor/:uid/',
    component: () => import('@/components/TEditor/wangEditor.vue'),
    children: [
      {
        path:':blogid',
        component: () => import('@/components/TEditor/wangEditor.vue'),
      }
    ]
  },
  {
    name: '登录注册页',
    path: '/logReg/',
    component: () => import('@/views/logReg.vue'),
    children: [
      {
        name: '登录页',
        path: 'login',
        component: () => import('@/components/logReg/login.vue')
      },
      {
        name: '注册页',
        path: 'regist',
        component: () => import('@/components/logReg/regist.vue')
      },
      {
        name: '找回密码',
        path: 'forgivePswd',
        component:()=>import('@/components/logReg/forgivePswd.vue')
      },
    ]
  },
  {
    name: '博客页面',
    path: '/post/:blogid',
    component:()=>import('@/components/blogShow/post.vue'),
  },
  {
    name: '个人中心页',
    path: '/user/:uid/',
    component: () => import('@/views/personal.vue'),
    component: () => import('@/components/perconalCenter/user.vue'),
  },
  {
    name: '个人设置页面',
    path: '/creator/:uid/settings/:settingid',
    component: () => import('@/views/creator.vue')
  },
  {
    name: '管理员登录',
    path: '/admin',
    component:()=>import('@/views/adminlogin.vue')
  },
  {
    name:'后台管理页面',
    path: '/admin/:manage/',
    component: () => import('@/views/admin.vue'),
  },
  {
    path: '/error',
    name: 'ERROR404',
    component: () => import(/* webpackChunkName: "error404" */ "@/views/error404.vue"),
  },
  {
    name: '主页搜索页面',
    path: '/search/:searchType/',
    component:()=>import ('@/views/searchshow.vue')
  }

];

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router