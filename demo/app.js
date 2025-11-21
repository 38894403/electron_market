const { createApp } = Vue;

// Vue应用配置
const app = createApp({
  data() {
    return {
      title: 'Market App',
      message: '欢迎使用Vue驱动的Electron应用！',
      currentName: '',
      showType1: false,
      showType2: false,
      showType3: false,
    }
  },
  methods: {
    closeApp() {
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('app-quit');
    },
    toggleComponent() {
      this.showComponent = !this.showComponent;
    },
    changeName(name) {
      this.currentName = name;
    }
  },
  mounted() {
    // 应用挂载后的初始化逻辑
    // console.log('Vue应用已启动');
    
    // 获取环境变量
    const { ipcRenderer } = require('electron');
    ipcRenderer.invoke('get-env').then(env => {
      // console.log('当前环境:', env);
      if (env) {
        this.message = `当前环境: ${env}`;
      }
    });
  }
});

// 注册组件
// app.component('market-component', MarketComponent);
app.component('market-panel', MarketPanel);

// 挂载Vue应用到DOM
app.mount('#app');
