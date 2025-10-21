// Vue组件示例
const MarketComponent = {
  template: `
    <div class="market-component">
      <h3>{{ componentTitle }}</h3>
      <button @click="incrementCounter" class="counter-btn">
        点击次数: {{ counter }}
      </button>
      <div class="status">
        状态: {{ status }}
      </div>
    </div>
  `,
  data() {
    return {
      componentTitle: '市场组件',
      counter: 0,
      status: '活跃'
    }
  },
  methods: {
    incrementCounter() {
      this.counter++;
      if (this.counter > 5) {
        this.status = '繁忙';
      }
    }
  }
};

// 导出组件供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarketComponent;
} else {
  window.MarketComponent = MarketComponent;
}
