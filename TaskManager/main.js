/**
 * Created by Виктория on 06.08.2017.
 */
const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const fs = require('fs')

let win = null

app.on('ready', () => {
    win = new BrowserWindow({width:900, height: 600})
    win.loadURL('file://' + path.join(__dirname,'index.html'))

    win.webContents.openDevTools()

    win.webContents.on('did-finish-load', () => {
        openFile()
    })

    win.on('closed', () => {
        win = null;
    })
})


function openFile() {

    const file = path.resolve('./tasks/tasks.json')
    const content = fs.readFileSync(file)

    win.webContents.send('file-opened', file, content)
}





