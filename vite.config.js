import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from "path"
import Iconify from 'vite-plugin-iconify'

export default defineConfig({
  base: './',
  plugins: [
    Iconify({
      // 这些匹配的文件将会搜索组件属性做替换
      include: [
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // 可替换并注入的组件属性
      replaceableProps: [
        // 预设的 UI 库
        // 对应一组自定义配置
        'veno-ui',
        // 自定义
        { component: 'VIcon', props: ['icon'] },
      ]
    }),
    vue({
      script: {
        defineModel: true,
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css:{
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
      },
    },
  },
  envPrefix: "APP_",
  server: {
    hmr: true,
    port: 3001,
    // proxy: {
    //   '/api': {
    //     target: "",// loadEnv(mode, process.cwd()).VITE_APP_PROXY_TARGET, // 目标代理接口地址
    //     secure: false,
    //     changeOrigin: true, // 开启代理，本地创建一个虚拟服务器
    //     PathRewrite:{
    //       '^api':"/api",
    //     }
    //   }
    // }
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve('src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
