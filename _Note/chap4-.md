# chapter: 4

## 1 实现的效果

## 2 关键效果的技术细节
### 2.1 jsonp 的魔改
1. 使用的模块 webmodules / jsonp
2. jsonp(url, opts, fn)
3. 将其 promise 化（@common/js）
### 2.2 recommend api
1. @src/api/recommend.js (but, 相当遗憾，并没有用到)
2. @src/api/config.js 公共的参数
### 2.3 recommend 组件
1. 在 created 请求数据
2. 可以使用语义化的 ERR_OK
### 2.4 开发轮播图组件 slider
1. 基础组件放在 @src/base 上
2. 

## 3 我对效果的改良

## 4 知识点拾遗
1. encodeURIComponent(URIstring) -> 对 URIstring 编码，其中的某些字符将被十六进制的转义序列进行替换
2. substr(start [, length]), substring(start [, end]) // substring == slice