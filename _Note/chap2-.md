# chapter: 2

## 1 实现的效果

## 2 关键效果的技术细节
### 2.1 初始化项目
```
vue init webpack vue-music
// 一些初始化的问答
cd vue-music/
npm install
npm run dev
```
### 2.2 项目结构
1. api -> 后端请求相关
2. common -> 包含很多东西：fonts, image, js, stylus，最后在 main.js 引入
3. components -> 组件
4. router -> 路由
5. store -> vuex 相关
6. App.vue
7. main.js
### 2.3 package.json 的修改
1. 增加 stylus, stylus-loader 的依赖
### 2.4 webpack 的配置
1. webpack.base.conf.js 增加 alias
2. `resolve = dir => path.join(__dirname, '..', dir)`

## 3 我对效果的改良

## 4 知识点拾遗
1. .gitkeep 文件：空的文件夹仍然能托管到 github
