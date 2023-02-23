var codeArr = [
  {
    code: "1.000001",
    text: "A",
  },
  {
    code: "1.516110",
    text: "建材",
  },
  {
    code: "1.601788",
    text: "gdzq",
  },
  {
    code: "1.512000",
    text: "qs",
  },
]
var defaultCode = codeArr.map((item) => item.code).join(",")

var container = document.getElementById("container")
var popover = container.querySelector(".popover")
codeArr.forEach((item, index) => {
  var priceDom = document.createElement("span")
  container.append(priceDom)
})
var priceDomList = container.getElementsByTagName("span")
Array.from(priceDomList).forEach((item, index) => {
  item.addEventListener("mouseover", function (e) {
    popover.innerText = codeArr[index].text
  })
  item.addEventListener("mouseleave", function () {
    popover.innerText = ""
  })
})
var api =
  "https://19.push2.eastmoney.com/api/qt/ulist/sse?invt=3&pi=0&pz=14&mpi=2000&secids=" +
  defaultCode +
  "&ut=6d2ffaa6a585d612eda28417681d58fb&fields=f12,f13,f19,f14,f139,f148,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100&po=1"
var source = new EventSource(api)
source.onmessage = function (event) {
  var data = JSON.parse(event.data).data
  renderPrice(data.diff)
}

function renderPrice(diff) {
  for (var index in diff) {
    var data = diff[index]
    var rate = data && data.f3
    if (rate) priceDomList[index].innerText = ~~rate / 100
  }
}
