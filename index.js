const { app, BrowserWindow, Menu } = require("electron")

let mainWindow = null
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 80,
    frame: false, // 隐藏任务栏
    alwaysOnTop: true, // 窗口置顶
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      // devTools: true,
      nodeIntegration: true, //设置为true就可以在这个渲染进程中调用Node.js
    },
  })

  mainWindow.setMenu(null)
  Menu.setApplicationMenu(null)

  mainWindow.loadFile("index.html") // 加载本地文件
  // mainWindow.loadURL('https://zhuiyi.ai/'); // 加载远程文件

  // mainWindow.webContents.openDevTools({ mode: "bottom" }) // 控制台开关

  mainWindow.on("close", (e) => {
    // 在窗口要关闭的时候触发
    e.preventDefault() // 避免进程意外关闭导致进程销毁
  })

  mainWindow.on("closed", () => {
    // 当窗口已经关闭的时候触发
  })
})
