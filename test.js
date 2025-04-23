const { ipcRenderer } = require("electron")
const { TYPE_1 } = require("./codes/type1")
const { TYPE_2 } = require("./codes/type2")


let priceDomList = []

async function getEnv() {
  const envValue = await ipcRenderer.invoke("get-env")
  return envValue
}

function renderPrice(diff) {
  for (var index in diff) {
    var data = diff[index]
    var rate = data && data.f3
    if (rate) priceDomList[index].innerText = ~~rate / 100
  }
}

getEnv().then((envValue) => {
  const codeArr = envValue === "1" ? TYPE_1 : TYPE_2

  var defaultCode = codeArr.map((item) => item.code).join(",")

  var container = document.getElementById("container")
  var popover = container.querySelector(".popover")
  codeArr.forEach((item, index) => {
    var priceDom = document.createElement("span")
    container.append(priceDom)
  })
  priceDomList = container.getElementsByTagName("span")
  Array.from(priceDomList).forEach((item, index) => {
    item.addEventListener("mouseover", function (e) {
      popover.innerText = codeArr[index].text
    })
    item.addEventListener("mouseleave", function () {
      popover.innerText = ""
    })
  })

  // 东方财富API
  var api =
    "https://19.push2.eastmoney.com/api/qt/ulist/sse?invt=3&pi=0&pz=14&mpi=2000&secids=" +
    defaultCode +
    "&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100&po=1"
  var source = new EventSource(api)
  source.onmessage = function (event) {
    var data = JSON.parse(event.data).data
    renderPrice(data.diff)
  }
})
