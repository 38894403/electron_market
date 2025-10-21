# Vue框架集成指南

## 概述
本项目已成功集成Vue 3框架，将原有的原生JavaScript应用转换为Vue驱动的应用。

## 项目结构
```
electron_market/
├── index.html          # 主HTML文件，包含Vue应用挂载点
├── app.js              # Vue应用主文件
├── components/         # Vue组件目录
│   └── MarketComponent.js  # 示例Vue组件
├── index.css           # 样式文件
├── index.js            # Electron主进程文件
└── package.json        # 项目依赖配置
```

## 主要特性

### 1. Vue 3 集成
- 使用Vue 3的Composition API
- 支持响应式数据绑定
- 组件化开发

### 2. 现有功能保留
- Electron窗口控制
- IPC通信
- 环境变量获取
- 应用退出功能

### 3. 新增Vue功能
- 响应式数据管理
- 组件系统
- 事件处理
- 条件渲染

## 使用方法

### 启动应用
```bash
npm start
```

### 开发新组件
1. 在`components/`目录下创建新的`.js`文件
2. 定义Vue组件对象
3. 在`app.js`中注册组件
4. 在HTML模板中使用组件

### 示例组件结构
```javascript
const MyComponent = {
  template: `
    <div class="my-component">
      <h3>{{ title }}</h3>
      <button @click="handleClick">{{ buttonText }}</button>
    </div>
  `,
  data() {
    return {
      title: '我的组件',
      buttonText: '点击我'
    }
  },
  methods: {
    handleClick() {
      // 处理点击事件
    }
  }
};
```

## 技术栈
- **前端框架**: Vue 3
- **桌面应用**: Electron
- **构建工具**: npm
- **样式**: CSS3

## 注意事项
1. 确保在HTML中正确引入Vue库和组件文件
2. 组件文件需要在主应用文件之前加载
3. 使用`-webkit-app-region: no-drag`来允许用户交互
4. IPC通信功能已集成到Vue方法中

## 下一步开发建议
1. 创建更多业务组件
2. 添加Vue Router进行路由管理
3. 集成状态管理（如Pinia）
4. 添加TypeScript支持
5. 实现组件单元测试


