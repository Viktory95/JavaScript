/**
 * Created by Виктория on 03.08.2017.
 */
const electron = require('electron')
const ipc = electron.ipcRenderer
const $ = selector => document.querySelector(selector)
const marked = require('marked')
const remote = electron.remote

const $col4 = $('.col-sm-4')

const $col8 = $('.col-sm-8')
const $name = $('#name')
const $descr = $('.descr')
const $dates = $('.dates')
const $plTime = $('.plTime')
const $factTime = $('.factTime')

ipc.on('file-opened', (event, file, content) => {
    let id = null
    let name = null
    let description = null
    let create_date = null
    let finish_date = null
    let plan_time = null
    let fact_time = null
    //get data from tasks.json
    JSON.parse(content, function (k, v) {
        switch (k) {
            case 'id':
                id = v
                break
            case 'name':
                name = v
                break
            case 'description':
                description = v
                break
            case 'create_date':
                create_date = v
                break
            case 'finish_date':
                finish_date = v
                break
            case 'plan_time':
                plan_time = v
                break
            case 'fact_time':
                fact_time = v

                //create div elemet
                let div = document.createElement('div')
                let ul = document.createElement('ul')
                ul.className = 'team'
                let liName = document.createElement('li')
                liName.className = 'liName'
                let liDescription = document.createElement('li')
                liDescription.className = 'liDescription'
                let liDates = document.createElement('li')
                liDates.className = 'liDates'
                let liPlTime = document.createElement('li')
                liPlTime.className = 'liPlTime'
                let liFactTime = document.createElement('li')
                liFactTime.className = 'liFactTime'

                //set attributes
                liName.innerText =name
                liDescription.innerText = description
                liDates.innerText = create_date + (finish_date == null ? '' : (' - ' + finish_date))
                liPlTime.innerText = plan_time
                liFactTime.innerText = fact_time

                //add lis from ul
                ul.append(liName, liDescription, liDates, liPlTime, liFactTime)

                //add ul from div
                div.className = finish_date == null ? 'elemActiv' : 'elemPassiv'
                div.id = id
                div.append(ul)

                //add div from main form
                $col4.append(div)

                //set data from right panel
                //TODO: liPlTime.innerText === 'null' and liFactTime.innerText === 'null' doesn't work
                div.addEventListener('click', () => {
                    $name.innerText = liName.innerText === 'null' ? 'Task name' : liName.innerText
                    $descr.innerText = liDescription.innerText === 'null' ? 'Task description' : liDescription.innerText
                    $dates.innerText = liDates.innerText === 'null' ? new Date().toJSON().slice(0,10).replace(/-/g,'.') : liDates.innerText
                    $plTime.innerText = liPlTime.innerText === 'null' ? 'Task plan time' : liPlTime.innerText
                    $factTime.innerText = liFactTime.innerText === 'null' ? 'Task fact time' : liFactTime.innerText
                })

                break
        }
    })
})

//replace label to input element
$name.addEventListener('click', replaseInput)
$descr.addEventListener('click', replaseInput)
$dates.addEventListener('click', replaseInput)
$plTime.addEventListener('click', replaseInput)
$factTime.addEventListener('click', replaseInput)

function replaseInput() {
    let inp = document.createElement('input')
    inp.className = 'form-control'
    inp.value = this.innerText
    inp.id = 'name'
    this.replaceWith( inp )
}

//TODO: replace input to label