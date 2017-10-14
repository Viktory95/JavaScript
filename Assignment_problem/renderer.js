/**
 * Created by Виктория on 03.08.2017.
 */
const electron = require('electron')
const ipc = electron.ipcRenderer
const $ = selector => document.querySelector(selector)
const marked = require('marked')

const $htmlView = $('.rendered-html')
const $matrSize = $('#matrSize')
const $inptBtn = $('#inptBtn')
const $matr = $('#matr')
const $calcBtn = $('#calcBtn')
const $removeBtn = $('#removeBtn')
const $table = $('#table')

let matrSize
let matrVals

let xy, yx             // Паросочетания: xy[разраб], yx[задача]
let vx, vy            // Альтернирующее дерево vx[разраб], vy[задача]
let minrow, mincol     // Способности, изученность


ipc.on('file-opened', (event, file, content) => {

})

$removeBtn.addEventListener('click', () => {
    while($matr.children.length>0)
{
    for (let elNum = 0; elNum < $matr.children.length; elNum++) {
       // console.log($matr.children[elNum])
        $matr.children[elNum].remove()
    }
}
})

$inptBtn.addEventListener('click', () => {
    while($matr.children.length>0)
{
    for (let elNum = 0; elNum < $matr.children.length; elNum++) {
        // console.log($matr.children[elNum])
        $matr.children[elNum].remove()
    }
}
    matrSize = parseInt($matrSize.value)
//    console.log("Matr size = " + matrSize)
    matrVals = new Array(matrSize)
    for (var i = 0; i < matrSize; i++) {
        matrVals[i] = new Array(matrSize)
    }
    xy = new Array(matrSize)
    yx = new Array(matrSize)
    vx = new Array(matrSize)
    vy = new Array(matrSize)
    minrow = new Array(matrSize)
    mincol = new Array(matrSize)
    for(let row = 0; row<matrSize; row++){
        let col1 = document.createElement('tr')
        for(let col=0; col<matrSize; col++){
            let td = document.createElement('td')
            let inpt = document.createElement('input')
            inpt.className = 'form-control'
            inpt.id = row + '_' + col
            td.append(inpt)
            col1.append(td)
        }
        $matr.append(col1)
    }
})

$calcBtn.addEventListener('click', () => {
    var trs = $table.getElementsByTagName('tr')
    var tds = null

    for (var i=0; i<trs.length; i++)
    {
        tds = trs[i].getElementsByTagName('td')
        for (let n=0; n<trs.length;n++)
        {
            let inpt = tds[n].getElementsByTagName('input')
            let nums = inpt[0].id.split('_')
            matrVals[parseInt(nums[1])][parseInt(nums[0])] = parseInt(inpt[0].value)
//            console.log('Value = ' + matrVals[parseInt(nums[0])][parseInt(nums[1])])
        }
    }

    for (let i=0; i<matrSize; i++)
    {
        minrow[i] = Number.POSITIVE_INFINITY
        mincol[i] = Number.POSITIVE_INFINITY
    }
    for (let i=0; i<matrSize; i++) {
        for (let j = 0; j < matrSize; j++) {
            minrow[i] = Math.min(minrow[i], matrVals[i][j])
        }
        //console.log('minCol ' + i + ' = ' + minrow[i])
    }
    for (let j = 0; j < matrSize; j++) {
        for (let i = 0; i < matrSize; i++) {
            mincol[j] = Math.min(mincol[j], matrVals[i][j] - minrow[i])
        }
        //console.log('minRow ' + j + ' = ' + mincol[j])
    }
for (let i=0; i<matrSize; i++)
{
    xy[i] = -1
    yx[i] = -1
}

for (let c=0; c<matrSize; ) {
    for (let i=0; i<matrSize; i++)
    {
        vx[i] = 0
        vy[i] = 0
    }
    let k = 0
    for (let i=0; i<matrSize; ++i) {
        if (xy[i] == -1 && dotry(i)) {
            ++k
        }
    }
    c += k
    if (k == 0) {
        let z = Number.POSITIVE_INFINITY
        for (let i=0; i<matrSize; ++i) {
            if (vx[i]) {
                for (let j = 0; j < matrSize; ++j)
                    if (!vy[j]) {
                        z = Math.min(z, matrVals[i][j] - minrow[i] - mincol[j])
                    }
            }
        }
        for (let i=0; i<matrSize; ++i) {
            if (vx[i]) minrow[i] += z
            if (vy[i]) mincol[i] -= z
        }
    }
}

let ans = 0
for (let i=0; i<matrSize; ++i) {
    ans += matrVals[i][xy[i]]
}
console.log('Res = ' + ans)
//printf ("%d\n", ans);
for (let i=0; i<matrSize; ++i) {
    console.log('Nums = ' + (xy[i] + 1))
  //  printf("%d ", xy[i] + 1);
}
})

function dotry (i) {
    if (vx[i]) return false;
    vx[i] = true;
    for (let j=0; j<matrSize; ++j)
    if (matrVals[i][j]-minrow[i]-mincol[j] == 0)
        vy[j] = true;
    for (let j=0; j<matrSize; ++j)
    if (matrVals[i][j]-minrow[i]-mincol[j] == 0 && yx[j] == -1) {
        xy[i] = j;
        yx[j] = i;
        return true;
    }
    for (let j=0; j<matrSize; ++j)
    if (matrVals[i][j]-minrow[i]-mincol[j] == 0 && dotry (yx[j])) {
        xy[i] = j;
        yx[j] = i;
        return true;
    }
    return false;
}
