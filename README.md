# Editor Demo

## 简介

该项目由开发者根据**稀土掘金的谭光志先生**的文档和Github重构，由此特别感谢。

开发者在原有的Vue2 + VueX基础上，将项目升级重构为Vue3 + Pinia

[可视化拖拽组件库一些技术要点原理分析](https://github.com/woai3c/Front-end-articles/issues/19)

[可视化拖拽组件库一些技术要点原理分析（二）](https://github.com/woai3c/Front-end-articles/issues/20)

[可视化拖拽组件库一些技术要点原理分析（三）](https://github.com/woai3c/Front-end-articles/issues/21)

[可视化拖拽组件库一些技术要点原理分析（四）](https://github.com/woai3c/Front-end-articles/issues/33)

## 技术栈 

- Vue3
- Vite
- Pinia
- Typescript
- animate.css 动画库
- element-plus 样式库
- echarts 图表库
- lodash 函数库
- mitt 事件收发库
- vue-router 路由库

## 项目功能

- [x] 编辑器 - 画布
- [x] 自定义组件 
- [x] 拖拽
- [x] 删除组件、调整图层层级
- [x] 放大缩小
- [x] 撤销重做
- [x] 吸附
- [x] 编辑器 - 基础属性栏
- [x] 预览、保存数据
- [x] 编辑器 - 绑定事件
- [x] 编辑器 - 绑定动画
- [ ] 拖拽旋转
- [ ] 复制 - 粘贴 - 剪切
- [ ] 数据交互
- [ ] 发布
- [ ] 组件组合与拆分
- [ ] 文本组件
- [ ] 矩形组件
- [ ] 锁定组件
- [ ] 快捷键
- [ ] 网格线
- [ ] 动态属性面板
- [ ] 动态数据来源
- [ ] 组件联动
- [ ] 组件按需加载

## 构建

```shell
# Init
pnpm init
```
```shell
# Dev
pnpm run dev
```
```shell
# Build
pnpm run build
```