/**
 * Created by Виктория on 14.10.2017.
 */
const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const dialog = electron.dialog
const fs = require('fs')

let win = null

app.on('ready', () => {
    win = new BrowserWindow({width:900, height: 600})
    //win.maximize()
    win.loadURL('file://' + path.join(__dirname,'index.html'))

//win.webContents.openDevTools()

win.webContents.on('did-finish-load', () => {
    win.webContents.send('file-opened')
})

win.on('closed', () => {
    win = null;
})
})

function openFile() {
    const files = dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [
            {name: 'Markdown Files', extensions: ['md', 'markdown', 'txt']}
        ]
    })

    if (!files) return

    const file = files[0]

    win.webContents.send('file-opened', file)
}

exports.openFile = openFile