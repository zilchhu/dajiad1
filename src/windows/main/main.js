const { ipcRenderer } = require('electron')

function add(shop) {
  ipcRenderer.send('add', shop)
}