/**
 * Created by Виктория on 06.08.2017.
 */

const path = require('path')
const fs = require('fs')

function openFile() {

    const content = fs.readFileSync(path.resolve('./tasks/tasks.json')).toString()

    return content
}

exports.openFile = openFile