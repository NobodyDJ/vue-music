const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router')
module.exports = defineConfig({
  transpileDependencies: true,
  // 全局配置sass文件 具体查看vue cli文档
  css: {
    loaderOptions: {
      sass: {
        // 引入全局变量和mixin
        additionalData: `
          @import '@/assets/scss/variable.scss';
          @import '@/assets/scss/mixin.scss';
        `
      }
    }
  },
  // webpack的设置此处未知
  devServer: {
    onBeforeSetupMiddleware(app) {
      registerRouter(app.app)
    }
  }
})
