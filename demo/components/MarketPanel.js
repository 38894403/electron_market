const { ipcRenderer } = require("electron")
const { TYPE_1 } = require("../codes/type1")
const { TYPE_2 } = require("../codes/type2")
// const { onMounted } = require("vue")

const typeMap = {
  'type1': TYPE_1,
  'type2': TYPE_2,
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
    this.source && this.source.close()
  },
  methods: {
    async getEnv() {
      const envValue = await ipcRenderer.invoke("get-env")
      return envValue
    },

    init() {
      this.getEnv().then((envValue) => {
        // const codeArr = envValue === "2" ? TYPE_2 : TYPE_1
        const codeArr = typeMap[this.type]

        var defaultCode = codeArr.map((item) => item.code).join(",")
        this.priceList = codeArr.map((item) => {
          return {
            code: item.code,
            text: item.text,
            rate: "-",
          }
        })

        // 东方财富API
        var api =
          "https://19.push2.eastmoney.com/api/qt/ulist/sse?invt=3&pi=0&pz=14&mpi=2000&secids=" +
          defaultCode +
          "&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100&po=1"
        var source = (this.source = new EventSource(api))
        source.onmessage = (event) => {
          var data = JSON.parse(event.data).data
          data && this.renderPrice(data.diff)
        }
        source.onerror = (err) => {
          console.log("LOG source.onerror :", err)
          source.close()
        }
      })
    },

    renderPrice(diff) {
      for (var index in diff) {
        var data = diff[index]
        var price = data && data.f2
        var rate = data && data.f3
        // if (price) {
        //   const unit = String(price).length <= 4 ? 1000 : 100
        //   this.priceList[index].price = ~~price / unit
        // }
        price && (this.priceList[index].price = ~~price)
        rate && (this.priceList[index].rate = ~~rate / 100)
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
