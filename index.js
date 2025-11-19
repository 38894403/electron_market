const { app, BrowserWindow, Menu, ipcMain } = require("electron")
const fs = require('fs')
const path = require('path')
const os = require('os')

const envValue = process.env.env

// 获取配置文件路径
function getConfigPath() {
  const userHome = os.homedir()
  const configDir = path.join(userHome, '.market-app')
  const configFile = path.join(configDir, 'type2_config.json')
  
  // 确保配置目录存在
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
  
  // 如果配置文件不存在，创建默认配置
  if (!fs.existsSync(configFile)) {
    const defaultConfig = {
      "TYPE_2": [
        {
          "code": "122.XAU",
          "text": "金-美"
        }
      ]
    }
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), 'utf8')
  }
  
  return configFile
}

// 读取TYPE_2配置数据
function loadType2Config() {
  try {
    const configPath = getConfigPath()
    const configData = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(configData)
    return config.TYPE_2 || []
  } catch (error) {
    console.error('读取TYPE_2配置文件失败:', error)
    return []
  }
}

// 监听渲染进程的请求，发送环境变量
ipcMain.handle("get-env", () => {
  return envValue
})

// 监听渲染进程的请求，发送TYPE_2配置数据
ipcMain.handle("get-type2-config", () => {
  return loadType2Config()
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
