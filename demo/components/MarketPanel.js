const { ipcRenderer } = require("electron")
const { TYPE_1 } = require("../codes/type1")
// const { onMounted } = require("vue")

// 异步获取TYPE_2数据
async function getType2Data() {
  try {
    return await ipcRenderer.invoke('get-type2-config');
  } catch (error) {
    console.error('获取TYPE_2配置数据失败:', error);
    return [];
  }
}

const typeMap = {
  'type1': TYPE_1,
  'type2': null, // 将在运行时动态获取
}

// Vue组件示例
const MarketPanel = {
  template: `
    <div class="market-panel">
      <span class="popover">{{ currentText }}</span>
      <span v-for="item in priceList" :key="item.code" @mouseenter="changeName(item.text + ': ' + item.price)" @mouseleave="changeName('')">{{item.rate}}</span>
    </div>
  `,
  data() {
    return {
      source: null,
      priceDomList: [],
      currentText: "",
      priceList: [{ code: 1, text: "123", rate: 456 }],
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      reconnectTimer: null,
    }
  },
  props: {
    type: {
      type: String,
      default: 'type1',
    },
  },
  mounted() {
    this.init()
  },
  beforeUnmount() {
    // 清理 EventSource 连接
    if (this.source) {
      this.source.close()
      this.source = null
    }
    // 清理重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  },
  methods: {
    async getEnv() {
      const envValue = await ipcRenderer.invoke("get-env")
      return envValue
    },

    async init() {
      try {
        const envValue = await this.getEnv();
        let codeArr;

        if (this.type === 'type2') {
          // 异步获取TYPE_2数据
          codeArr = await getType2Data();
        } else {
          codeArr = typeMap[this.type];
        }

        if (!codeArr || codeArr.length === 0) {
          console.error('无法获取配置数据');
          return;
        }

        var defaultCode = codeArr.map((item) => item.code).join(",")
        this.priceList = codeArr.map((item) => {
          return {
            code: item.code,
            text: item.text,
            rate: "-",
          }
        })

        // 保存API地址供重连使用
        this.apiUrl =
          "https://19.push2.eastmoney.com/api/qt/ulist/sse?invt=3&pi=0&pz=14&mpi=2000&secids=" +
          defaultCode +
          "&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100&po=1"

        // 连接EventSource
        this.connectEventSource()
      } catch (error) {
        console.error('初始化失败:', error);
      }
    },

    connectEventSource() {
      if (!this.apiUrl) {
        console.error('API URL 未设置')
        return
      }

      try {
        // 关闭旧连接
        if (this.source) {
          this.source.close()
          this.source = null
        }

        console.log(`[${this.type}] 连接EventSource...`)
        const source = (this.source = new EventSource(this.apiUrl))

        source.onopen = () => {
          console.log(`[${this.type}] EventSource 连接成功`)
          // 连接成功，重置重连计数
          this.reconnectAttempts = 0
        }

        source.onmessage = (event) => {
          try {
            const result = JSON.parse(event.data)
            if (result && result.data && result.data.diff) {
              this.renderPrice(result.data.diff)
            } else {
              console.warn(`[${this.type}] 收到无效数据格式:`, result)
            }
          } catch (error) {
            console.error(`[${this.type}] 解析消息失败:`, error, event.data)
          }
        }

        source.onerror = (err) => {
          console.error(`[${this.type}] EventSource 错误:`, err)

          // 关闭当前连接
          if (this.source) {
            this.source.close()
            this.source = null
          }

          // 尝试重连
          this.attemptReconnect()
        }
      } catch (error) {
        console.error(`[${this.type}] 创建EventSource失败:`, error)
        this.attemptReconnect()
      }
    },

    attemptReconnect() {
      // 清除之前的重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }

      // 检查重连次数
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(`[${this.type}] 已达到最大重连次数 (${this.maxReconnectAttempts})，停止重连`)
        return
      }

      this.reconnectAttempts++
      const delay = this.reconnectDelay * this.reconnectAttempts // 递增延迟

      console.log(`[${this.type}] 将在 ${delay}ms 后进行第 ${this.reconnectAttempts} 次重连...`)

      this.reconnectTimer = setTimeout(() => {
        this.connectEventSource()
      }, delay)
    },

    renderPrice(diff) {
      if (!diff || typeof diff !== 'object') {
        console.warn('renderPrice: 无效的数据格式', diff)
        return
      }

      try {
        // diff 是对象，遍历对象的值
        const diffValues = Array.isArray(diff) ? diff : Object.values(diff)

        diffValues.forEach((data) => {
          if (!data) return

          const code = data.f12 // f12 是股票代码
          const price = data.f2  // f2 是当前价格
          const rate = data.f3   // f3 是涨跌幅

          // 在 priceList 中查找对应的项, 或者 for (var index in diff)
          const targetIndex = this.priceList.findIndex(item => {
            // 提取纯数字代码进行比较（去除市场前缀）
            const itemCode = String(item.code).split('.').pop()
            return String(code) === itemCode || String(item.code) === String(code)
          })

          if (targetIndex !== -1) {
          // if (price) {
          //   const unit = String(price).length <= 4 ? 1000 : 100
          //   this.priceList[index].price = ~~price / unit
          // }
            // 更新价格
            if (price !== undefined && price !== null) {
              this.priceList[targetIndex].price = ~~price
            }
            // 更新涨跌幅
            if (rate !== undefined && rate !== null) {
              this.priceList[targetIndex].rate = ~~rate / 100
            }
          } else {
            console.warn(`[${this.type}] 未找到匹配的代码: ${code}`, data)
          }
        })
      } catch (error) {
        console.error(`[${this.type}] renderPrice 执行错误:`, error)
      }
    },

    changeName(name) {
      this.$emit('change-name', name)
    }
  },
}

// 导出组件供其他文件使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = MarketPanel
} else {
  window.MarketPanel = MarketPanel
}
