const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router')
module.exports = defineConfig({
  transpileDependencies: true,
  // 全局配置sass文件 具体查看vue cli文档
  css: {
    loaderOptions: {
      sass: {
        // 引入全局变量和mixin，因为这里两个文件都是css变量没有立即生效在全局上的样式。
        additionalData: `
          @import '@/assets/scss/variable.scss';
          @import '@/assets/scss/mixin.scss';
        `
      }
    }
  },
  // webpack的设置此处未知，启用了一个node服务
  devServer: {
    onBeforeSetupMiddleware(app) {
      registerRouter(app.app)
    }
  }
})
