// vite.config.js
import { defineConfig, loadEnv } from "./node_modules/vite/dist/node/index.js";
import vue from "./node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "./node_modules/unplugin-auto-import/dist/vite.js";
import Components from "./node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "./node_modules/unplugin-vue-components/dist/resolvers.mjs";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  envPrefix: "APP_",
  server: {
    hmr: true,
    port: 3001,
    proxy: {
      "/api": {
        target: "",
        // loadEnv(mode, process.cwd()).VITE_APP_PROXY_TARGET, // 目标代理接口地址
        secure: false,
        changeOrigin: true,
        // 开启代理，本地创建一个虚拟服务器
        PathRewrite: {
          "^api": "/api"
        }
      }
    }
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve("src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RpbmdcXFxcd2ViXFxcXG15VnVlTGVhcm5pbmdcXFxcb2N0YmxvZy1mcm9udC1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQ29kaW5nXFxcXHdlYlxcXFxteVZ1ZUxlYXJuaW5nXFxcXG9jdGJsb2ctZnJvbnQtYWRtaW5cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0NvZGluZy93ZWIvbXlWdWVMZWFybmluZy9vY3RibG9nLWZyb250LWFkbWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gIF0sXG4gIGVudlByZWZpeDpcIkFQUF9cIixcbiAgc2VydmVyOiB7XG4gICAgaG1yOiB0cnVlLFxuICAgIHBvcnQ6IDMwMDEsXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6IFwiXCIsLy8gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKS5WSVRFX0FQUF9QUk9YWV9UQVJHRVQsIC8vIFx1NzZFRVx1NjgwN1x1NEVFM1x1NzQwNlx1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIFx1NUYwMFx1NTQyRlx1NEVFM1x1NzQwNlx1RkYwQ1x1NjcyQ1x1NTczMFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQVx1ODY1QVx1NjJERlx1NjcwRFx1NTJBMVx1NTY2OFxuICAgICAgICBQYXRoUmV3cml0ZTp7XG4gICAgICAgICAgJ15hcGknOlwiL2FwaVwiLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8gXHU5MTREXHU3RjZFXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzpwYXRoLnJlc29sdmUoJ3NyYycpLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VSxTQUFTLGNBQWMsZUFBZTtBQUMvVyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxVQUFVO0FBR2pCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxXQUFVO0FBQUEsRUFDVixRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsYUFBWTtBQUFBLFVBQ1YsUUFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQTtBQUFBLElBRVAsT0FBTztBQUFBLE1BQ0wsS0FBSSxLQUFLLFFBQVEsS0FBSztBQUFBLElBQ3hCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
