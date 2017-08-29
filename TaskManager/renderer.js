/**
 * Created by Виктория on 03.08.2017.
 */
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const ipc = electron.ipcRenderer
const $ = selector => document.querySelector(selector)
const marked = require('marked')
const remote = electron.remote

const file = path.resolve('./tasks/tasks.json')
const size = path.resolve('./tasks/size.json')

const $col4 = $('.col-sm-4')

const $col8 = $('.col-sm-8')
var $name = $('#name')
var $descr = $('#descr')
var $stDate = $('#stDate')
var $finDate = $('#finDate')
var $plTime = $('#plTime')
var $factTime = $('#factTime')

const $btnName = $('#btnName')
const $btnDescr = $('#btnDescr')
const $btnStDate = $('#btnStDate')
const $btnFinDate = $('#btnFinDate')
const $btnPlTime = $('#btnPlTime')
const $btnFactTime = $('#btnFactTime')
const $btnSave = $('#btnSave')
const $btnDelete = $('#btnDelete')

const $btnCreate = $('#create')

//initialize start data from file
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
            let liStDate = document.createElement('li')
            liStDate.className = 'liStDate'
            let liFinDate = document.createElement('li')
            liFinDate.className = 'liFinDate'

            let liPlTime = document.createElement('li')
            liPlTime.className = 'liPlTime'
            let liFactTime = document.createElement('li')
            liFactTime.className = 'liFactTime'

            //set attributes
            liName.innerText = name
            liDescription.innerText = description
            liStDate.innerText = create_date
            liFinDate.innerText = finish_date
            liPlTime.innerText = plan_time
            liFactTime.innerText = fact_time

            //add li from ul
            ul.append(liName, liDescription, liStDate, liFinDate, liPlTime, liFactTime)

            //add ul from div
            div.className = finish_date == null || finish_date === '' ? 'elemActiv' : 'elemPassiv'
            div.id = id
            div.append(ul)

            //add div from main form
            $col4.append(div)

            //set data from right panel, when user chick on left item
            div.addEventListener('click', () => {
                allInputToLabel()
                setDataToRightSide(div, liName, liDescription, liStDate, liFinDate, liPlTime, liFactTime)
            })

            break
        }
    })
})

$btnName.addEventListener('click', replaseInput)
$btnDescr.addEventListener('click', replaseInput)
$btnFactTime.addEventListener('click', replaseInput)
$btnFinDate.addEventListener('click', replaseInput)
$btnPlTime.addEventListener('click', replaseInput)
$btnStDate.addEventListener('click', replaseInput)

//change label to input and input to label
function replaseInput() {
    let elemId = this.id.substring(3, 4).toLowerCase() + this.id.substring(4, this.id.length)
    //element is LABEL
    if(this.className === 'btnChange'){
        let inp = document.createElement('input')
        inp.className = 'form-control'
        inp.id = elemId
        switch (elemId) {
            case 'name':
                inp.value = $name.innerText
                $name.replaceWith(inp)
                $name = $('#name')
                break;
            case 'descr':
                inp.value = $descr.innerText
                $descr.replaceWith(inp)
                $descr = $('#descr')
                break;
            case 'factTime':
                inp.value = $factTime.innerText
                $factTime.replaceWith(inp)
                $factTime = $('#factTime')
                break;
            case 'plTime':
                inp.value = $plTime.innerText
                $plTime.replaceWith(inp)
                $plTime = $('#plTime')
                break;
            case 'stDate':
                inp.value = $stDate.innerText
                $stDate.replaceWith(inp)
                $stDate = $('#stDate')
                break;
            case 'finDate':
                inp.value = $finDate.innerText
                $finDate.replaceWith(inp)
                $finDate = $('#finDate')
                break;
        }

        this.className = 'btnSave'
    }
    //element is INPUT
    else {
        //change input on label
        let inp = document.createElement('label')
        inp.id = elemId
        switch (elemId) {
            case 'name':
                inp.innerText = $name.value
                $name.replaceWith(inp)
                $name = $('#name')
                break;
            case 'descr':
                inp.innerText = $descr.value
                $descr.replaceWith(inp)
                $descr = $('#descr')
                break;
            case 'factTime':
                inp.innerText = $factTime.value
                $factTime.replaceWith(inp)
                $factTime = $('#factTime')
                break;
            case 'plTime':
                inp.innerText = $plTime.value
                $plTime.replaceWith(inp)
                $plTime = $('#plTime')
                break;
            case 'stDate':
                inp.innerText = $stDate.value
                $stDate.replaceWith(inp)
                $stDate = $('#stDate')
                break;
            case 'finDate':
                inp.innerText = $finDate.value
                $finDate.replaceWith(inp)
                $finDate = $('#finDate')
                break;
        }

        this.className = 'btnChange'
    }
}

//save button listener
$btnSave.addEventListener('click', () => {
    allInputToLabel()

    //read from file
    let content = fs.readFileSync(file)
    let json = JSON.parse(content)

    let flag = false

    for(let elNum = 0; elNum < json.length; elNum++){
        if(json[elNum]['id'].toString() === $col8.id){
            json[elNum]['name'] = $name.innerText
            json[elNum]['description'] = $descr.innerText
            json[elNum]['create_date'] = $stDate.innerText
            json[elNum]['finish_date'] = $finDate.innerText
            json[elNum]['plan_time'] = $plTime.innerText
            json[elNum]['fact_time'] = $factTime.innerText
            flag = true
        }
    }

    //add new element, is it does not exist
    if(!flag){
        json.push({"id":$col8.id,
            "name":$name.innerText,
            "description":$descr.innerText,
            "create_date":$stDate.innerText,
            "finish_date":$finDate.innerText,
            "plan_time":$plTime.innerText,
            "fact_time":$factTime.innerText})
    }

    //set data to left item
    for(let elNum=0; elNum<$col4.children.length; elNum++) {
        //get div by id
        if($col4.children[elNum].id === $col8.id){
            //get first ul
            let ul = $col4.children[elNum].children[0]
            //get all li elements
            for(let liElNum=0; liElNum<ul.children.length; liElNum++) {
                switch (ul.children[liElNum].className) {
                    case 'liName':
                        ul.children[liElNum].innerText = $name.innerText
                        break
                    case 'liDescription':
                        ul.children[liElNum].innerText = $descr.innerText
                        break
                    case 'liStDate':
                        ul.children[liElNum].innerText = $stDate.innerText
                        break
                    case 'liFinDate':
                        ul.children[liElNum].innerText = $finDate.innerText
                        $col4.children[elNum].className = $finDate.innerText == null || $finDate.innerText === '' ? 'elemActiv' : 'elemPassiv'
                        break
                    case 'liPlTime':
                        ul.children[liElNum].innerText = $plTime.innerText
                        break
                    case 'liFactTime':
                        ul.children[liElNum].innerText = $factTime.innerText
                        break
                }
            }
        }
    }

    //save file task.json
    fs.writeFile(file, JSON.stringify(json), 'utf8', function(){
        console.log('Data saved.')
    })
})

$btnCreate.addEventListener('click', () => {
    //create div elemet
    let div = document.createElement('div')
    let ul = document.createElement('ul')
    ul.className = 'team'
    let liName = document.createElement('li')
    liName.className = 'liName'
    let liDescription = document.createElement('li')
    liDescription.className = 'liDescription'
    let liStDate = document.createElement('li')
    liStDate.className = 'liStDate'
    let liFinDate = document.createElement('li')
    liFinDate.className = 'liFinDate'
    let liPlTime = document.createElement('li')
    liPlTime.className = 'liPlTime'
    let liFactTime = document.createElement('li')
    liFactTime.className = 'liFactTime'

    //set attributes
    liName.innerText = 'Новая задача'
    liStDate.innerText = new Date().toJSON().slice(0,10).replace(/-/g,'.')

    //add li from ul
    ul.append(liName, liDescription, liStDate, liFinDate, liPlTime, liFactTime)

    //add ul from div
    div.className = 'elemActiv'
    let content = fs.readFileSync(size)
    let json = JSON.parse(content)

    div.id = json[0]['size'] + 1
    div.append(ul)

    //add div from main form
    $col4.append(div)

    //set data from right panel, when user chick on left item
    //TODO: liStDate.innerText === 'null' doesn't work
    div.addEventListener('click', () => {
        allInputToLabel()
        setDataToRightSide(div, liName, liDescription, liStDate, liFinDate, liPlTime, liFactTime)
    })

    setDataToRightSide(div, liName, liDescription, liStDate, liFinDate, liPlTime, liFactTime)

    json[0]['size'] = json[0]['size']+1
    //save file task.json
    fs.writeFile(size, JSON.stringify(json), 'utf8', function(){
        console.log('Data saved.')
    })
})

$btnDelete.addEventListener('click', () => {
    //read from file
    let content = fs.readFileSync(file)
    let json = JSON.parse(content)
    let json2 = JSON.parse('[]')

    for(let elNum = 0; elNum < json.length; elNum++){
        if(json[elNum]['id'].toString() != $col8.id){
            json2.push(json[elNum])
        }
    }

    //delete from left item
    for(let elNum=0; elNum<$col4.children.length; elNum++) {
        //get div by id
        if ($col4.children[elNum].id === $col8.id) {
            $col4.children[elNum].remove()
        }
    }

    //save file task.json
    fs.writeFile(file, JSON.stringify(json2), 'utf8', function(){
        console.log('Data saved.')
    })
})

function setDataToRightSide(div, liName, liDescription, liStDate, liFinDate, liPlTime, liFactTime) {
    $name.innerText = liName.innerText
    $descr.innerText = liDescription.innerText
    //TODO: liStDate.innerText === 'null' doesn't work
    $stDate.innerText = liStDate.innerText === 'null' ? new Date().toJSON().slice(0,10).replace(/-/g,'.') : liStDate.innerText
    $finDate.innerText = liFinDate.innerText
    $plTime.innerText = liPlTime.innerText
    $factTime.innerText = liFactTime.innerText
    $col8.id = div.id
}

function allInputToLabel() {
    if($name.tagName === 'INPUT'){
        $btnName.click()
    }
    if($descr.tagName === 'INPUT'){
        $btnDescr.click()
    }
    if($stDate.tagName === 'INPUT'){
        $btnStDate.click()
    }
    if($finDate.tagName === 'INPUT'){
        $btnFinDate.click()
    }
    if($plTime.tagName === 'INPUT'){
        $btnPlTime.click()
    }
    if($factTime.tagName === 'INPUT'){
        $btnFactTime.click()
    }
}