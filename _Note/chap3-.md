# chapter: 3

## 1 实现的效果

## 2 关键效果的技术细节
### 2.1 package.json 的增加
1. babel 相关的
2. fastclick: 移动端默认 300ms 延迟
### 2.2 m-header 组件
1. 注意配置别名
2. 引用 variable, mixin; css 会多了 @, ~
3. bg-image 函数只处理了 background-image, 需要配合 background-size 使用
### 2.3 配置路由
1. 导入 Router
2. 导入 组件
3. `Vue.use(Router)`
4. `router = new Router({ routes: [ { path, component / redirect } ] })`
5. `new Vue({ el, render, router })`
6. 标签 router-view
7. 标签 router-link, 注意 attr

### 2.4 tab 组件

## 3 我对效果的改良

## 4 知识点拾遗
