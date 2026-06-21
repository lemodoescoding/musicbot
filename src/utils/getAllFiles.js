const fs = require('fs')
const path = require('path')

/**
 * @param {String} directory
 * */
module.exports = (directory, folderOnly = false) => {
    let filenames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true })

    for (const file of files) {
        const filePath = path.join(directory, file.name)

        if (folderOnly && file.isDirectory()) {
            filenames.push(filePath)
        }

        if (!folderOnly && file.isFile()){
            filenames.push(filePath)
        }
    }

    return filenames
}
