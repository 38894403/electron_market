const { app, BrowserWindow, Menu, ipcMain } = require("electron")

const envValue = process.env.env

// 监听渲染进程的请求，发送环境变量
ipcMain.handle("get-env", () => {
  return envValue
})

let mainWindow = null
let isQuitting = false
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 130,
    frame: false, // 隐藏任务栏
    alwaysOnTop: true, // 窗口置顶
    transparent: true,
    backgroundColor: "#00000000",
    webPreferences: {
      devTools: true,
      nodeIntegration: true, //设置为true就可以在这个渲染进程中调用Node.js
      contextIsolation: false, // 禁用上下文隔离
      enableRemoteModule: true, // 启用远程模块
    },
  })

  mainWindow.setMenu(null)
  Menu.setApplicationMenu(null)

  // mainWindow.loadFile("index.html") // 加载本地文件
  mainWindow.loadFile("demo/demo.html") // 加载本地文件
  // mainWindow.loadURL('https://zhuiyi.ai/'); // 加载远程文件

  // mainWindow.webContents.openDevTools({ mode: "bottom" }) // 控制台开关

  mainWindow.on("close", (e) => {
    // 在窗口要关闭的时候触发
    if (!isQuitting) {
      e.preventDefault() // 避免进程意外关闭导致进程销毁
    }
  })

  mainWindow.on("closed", () => {
    // 当窗口已经关闭的时候触发
  })
})

// 监听渲染进程的退出指令
ipcMain.on("app-quit", () => {
  isQuitting = true
  app.quit()
})
