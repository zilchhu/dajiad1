const { app, BrowserWindow, BrowserView, ipcMain } = require('electron')

var mainWin = null
var shopWins = []

function createWindow(partition, url) {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    parent: mainWin,
    webPreferences: { nodeIntegration: true, webSecurity: false, partition }
  })

  // win.loadFile('index.html')
  win.loadURL(url)
  return win
}

ipcMain.on('select-shop', (event, arg) => {
  if (!arg || !arg.platform) return
  // createView(`persist:${arg.shopId}`, arg.platform == '美团' ? 'https://e.waimai.meituan.com/#/v2/index' : 'https://melody.shop.ele.me/')

  if (shopWins.findIndex(shopWin => shopWin.shopId == arg.shopId) == -1) {
    let win = createWindow(`persist:${arg.shopId}`, arg.platform == '美团' ? 'https://e.waimai.meituan.com/#/v2/index' : 'https://melody.shop.ele.me/')
    shopWins.push({ shopId: arg.shopId, window: win })
  }
})

function createView(partition, url) {
  const view = new BrowserView({ webPreferences: { partition, nodeIntegration: true, webSecurity: false } })
  mainWin.setBrowserView(view)
  const mainWinBounds = mainWin.getBounds()
  view.setBounds({ x: 200, y: 0, width: mainWinBounds.width - 200, height: mainWinBounds.height })
  view.setAutoResize({ width: true, height: true })
  view.webContents.loadURL(url)
}

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false, webSecurity: false, webviewTag: true }
  })

  mainWin.loadFile('src/windows/main/main.html')
}

app.whenReady().then(() => {
  // createWindow('a')
  createMainWindow()
  // createWindow('b')
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
