/**
 * Created by Виктория on 14.10.2017.
 */
const electron = require('electron')
const $ = selector => document.querySelector(selector)
const marked = require('marked')
const fs = require('fs')
const path = require('path')

const $matrSize = $('#matrSize')
const $inptBtn = $('#inptBtn')
const $matr = $('#matr')
const $calcBtn = $('#calcBtn')
const $removeBtn = $('#removeBtn')
const $table = $('#table')
const $fromFileBtn = $('#fromFileBtn')
const $resultLabel = $('#resultLabel')

//файл с матрицей
const dataFile = path.resolve('./data.txt')

//размер матрицы
let matrSize
//значения матрицы
let matrVals

let xy, yx             // Паросочетания: xy[разраб], yx[задача]
let vx, vy            // Альтернирующее дерево vx[разраб], vy[задача]
let minrow, mincol     // Способности, изученность

//кнопка "Загрузить данные из файла"
$fromFileBtn.addEventListener('click', () => {
    //задать размер матрицы
    matrSize = parseInt($matrSize.value)

    //инициализация полей ввода для матрицы
    $inptBtn.click()

//чтение из файла
fs.readFile(dataFile, 'utf8', function(err, data) {
    if (err) throw err;
    let numerics = data.split(' ')
    let row = 0
    let col = 0
    for (let i = 0; i < numerics.length; i++) {
        if(i >= matrSize && (i%matrSize) == 0){
            //console.log('i = ' + i)
            row++
            col = 0
        }
        //console.log(row + '_' + col)
        //вывод значений на форму
        let inpt = document.getElementById(row + '_' + col)
        inpt.value = numerics[i]
        col++
    }
    //console.log('OK: ' + dataFile)
    //console.log(data)
})

})

//кнопка очистки
$removeBtn.addEventListener('click', () => {
    //проход по всем элемента таблицы
    while($matr.children.length>0)
    {

        for (let elNum = 0; elNum < $matr.children.length; elNum++) {
           // console.log($matr.children[elNum])
            $matr.children[elNum].remove()
        }
    }
    //очистка поля вывода ответа
    $resultLabel.innerText = ''
})

//кнопка "Ввести значений"
$inptBtn.addEventListener('click', () => {
    //очистка
    $removeBtn.click()
    //ввод размера матрицы
    matrSize = parseInt($matrSize.value)
//    console.log("Matr size = " + matrSize)
    //создание массива значений
    matrVals = new Array(matrSize)
    for (var i = 0; i < matrSize; i++) {
        matrVals[i] = new Array(matrSize)
    }
    //массивы для промежуточных вычислений
    xy = new Array(matrSize)
    yx = new Array(matrSize)
    vx = new Array(matrSize)
    vy = new Array(matrSize)
    minrow = new Array(matrSize)
    mincol = new Array(matrSize)
    //отрисовка ячеек для ввода значений матрицы
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

//кнопка "Решить"
$calcBtn.addEventListener('click', () => {
    //получение таблицы из формы
    var trs = $table.getElementsByTagName('tr')
    var tds = null

    //проход по полям таблицы
    for (var i=0; i<trs.length; i++)
    {
        tds = trs[i].getElementsByTagName('td')
        for (let n=0; n<trs.length;n++)
        {
            let inpt = tds[n].getElementsByTagName('input')
            let nums = inpt[0].id.split('_')
            //присвоение значений матрице
            matrVals[parseInt(nums[1])][parseInt(nums[0])] = parseInt(inpt[0].value)
//            console.log('Value = ' + matrVals[parseInt(nums[0])][parseInt(nums[1])])
        }
    }

    //присвоение максимального значений
    for (let i=0; i<matrSize; i++)
    {
        minrow[i] = Number.POSITIVE_INFINITY
        mincol[i] = Number.POSITIVE_INFINITY
    }
    //поиск минимума в каждой строке
    for (let i=0; i<matrSize; i++) {
        for (let j = 0; j < matrSize; j++) {
            minrow[i] = Math.min(minrow[i], matrVals[i][j])
        }
        //console.log('minCol ' + i + ' = ' + minrow[i])
    }
    //поиск минимума в каждом столбце
    for (let j = 0; j < matrSize; j++) {
        for (let i = 0; i < matrSize; i++) {
            mincol[j] = Math.min(mincol[j], matrVals[i][j] - minrow[i])
        }
        //console.log('minRow ' + j + ' = ' + mincol[j])
    }
    //присвоение первоначальных значений
    for (let i=0; i<matrSize; i++)
    {
        xy[i] = -1
        yx[i] = -1
    }

    //вычисление, пока количество нулей не будет равно размеру матрицы
    for (let c=0; c<matrSize; ) {
        //присвоение первоначальных значений
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
            //необхоодимые вычитания и прибавления
            for (let i=0; i<matrSize; ++i) {
                if (vx[i]) minrow[i] += z
                if (vy[i]) mincol[i] -= z
            }
        }
    }

    //формирование результата
    let result = 'Результат: '
    let ans = 0
    for (let i=0; i<matrSize; ++i) {
        result += matrVals[i][xy[i]] + '+'
        ans += matrVals[i][xy[i]]
        //выделение яцейки красным цветом
        let inpt = document.getElementById(xy[i] + '_' + i)
        inpt.style = 'background-color: #d9534f'
    }
    if(result.length > 0) {
        result = result.substring(0, result.length - 1) + '=' + ans
    }
    //console.log('Res = ' + ans)

    //вывод результата
    $resultLabel.innerText = result
})

//вычитание минимума столбца и строки
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
